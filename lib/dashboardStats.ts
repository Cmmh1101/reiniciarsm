import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export interface DashboardStats {
  leadsPerWeek: { weekStart: string; count: number }[];
  funnel: { quizCompleted: number; converted: number };
  revenuePerWeek: { weekStart: string; amountCents: number }[];
  totalRevenueCents: number;
  topArchetypes: { archetype: string; count: number }[];
}

const EMPTY_STATS: DashboardStats = {
  leadsPerWeek: [],
  funnel: { quizCompleted: 0, converted: 0 },
  revenuePerWeek: [],
  totalRevenueCents: 0,
  topArchetypes: [],
};

// Monday-start ISO date for the week containing `date` — used to group events/payments.
function startOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// Last `count` populated weeks, oldest first — drops weeks with no data instead of zero-filling,
// since the site is new enough that most weeks in a long window would otherwise be empty.
function lastWeeks<T extends { weekStart: string }>(rows: T[], count: number): T[] {
  return [...rows].sort((a, b) => a.weekStart.localeCompare(b.weekStart)).slice(-count);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createSupabaseAdminClient();

  const [{ data: events, error: eventsError }, { data: payments, error: paymentsError }] = await Promise.all([
    supabase.from("contact_events").select("contact_id, event_type, metadata, created_at"),
    supabase.from("stripe_payments").select("amount_cents, status, created_at"),
  ]);

  if (eventsError) {
    console.error("getDashboardStats: contact_events query failed", eventsError);
    return EMPTY_STATS;
  }
  if (paymentsError) {
    console.error("getDashboardStats: stripe_payments query failed", paymentsError);
  }

  const safeEvents = events ?? [];
  const safePayments = payments ?? [];

  const leadWeekMap = new Map<string, number>();
  const quizContacts = new Set<string>();
  const conversionEventsByContact = new Map<string, boolean>();
  const archetypeCounts = new Map<string, number>();

  for (const e of safeEvents) {
    if (e.event_type === "quiz_completed" || e.event_type === "newsletter_signup") {
      const wk = startOfWeek(new Date(e.created_at));
      leadWeekMap.set(wk, (leadWeekMap.get(wk) ?? 0) + 1);
    }
    if (e.event_type === "quiz_completed") {
      quizContacts.add(e.contact_id);
      const archetype = (e.metadata as { archetype?: string } | null)?.archetype;
      if (archetype) archetypeCounts.set(archetype, (archetypeCounts.get(archetype) ?? 0) + 1);
    }
    if (e.event_type === "booking_created" || e.event_type === "payment_completed") {
      conversionEventsByContact.set(e.contact_id, true);
    }
  }

  let converted = 0;
  for (const contactId of quizContacts) {
    if (conversionEventsByContact.get(contactId)) converted++;
  }

  const revenueWeekMap = new Map<string, number>();
  let totalRevenueCents = 0;
  for (const p of safePayments) {
    if (p.status !== "completed") continue;
    totalRevenueCents += p.amount_cents;
    const wk = startOfWeek(new Date(p.created_at));
    revenueWeekMap.set(wk, (revenueWeekMap.get(wk) ?? 0) + p.amount_cents);
  }

  return {
    leadsPerWeek: lastWeeks(
      [...leadWeekMap.entries()].map(([weekStart, count]) => ({ weekStart, count })),
      8
    ),
    funnel: { quizCompleted: quizContacts.size, converted },
    revenuePerWeek: lastWeeks(
      [...revenueWeekMap.entries()].map(([weekStart, amountCents]) => ({ weekStart, amountCents })),
      8
    ),
    totalRevenueCents,
    topArchetypes: [...archetypeCounts.entries()]
      .map(([archetype, count]) => ({ archetype, count }))
      .sort((a, b) => b.count - a.count),
  };
}
