// "What's your next step with technology?" — the site-wide quiz that routes a visitor to the right offer.
// Scoring is language-independent: each answer adds points to one or more profiles, and the profile with
// the most points wins. Question and answer text lives in lib/i18n/content/nextStep.ts.

export const PROFILES = ["sos", "clarity", "career", "learner", "business"] as const;
export type ProfileKey = (typeof PROFILES)[number];

type Points = Partial<Record<ProfileKey, number>>;

// POINTS[question][option] — option order matches the text in each language. 8 questions.
export const POINTS: Points[][] = [
  // 1. What brings you here?
  [{ sos: 3 }, { clarity: 3 }, { career: 3 }, { learner: 3 }, { business: 3 }],
  // 2. Comfort with technology
  [{ sos: 2, learner: 1 }, { clarity: 2, business: 1 }, { learner: 2, career: 1 }, { business: 2 }],
  // 3. Clarity of the next step
  [{ sos: 2, business: 1 }, { clarity: 2 }, { clarity: 2, career: 1 }, { career: 2, learner: 1 }],
  // 4. Time available this month
  [{ sos: 1, clarity: 2 }, { learner: 2, career: 1 }, { career: 2, business: 1 }, { business: 2 }],
  // 5. How they prefer to get help
  [{ sos: 3 }, { clarity: 3, career: 1 }, { career: 3 }, { learner: 3 }, { business: 3 }],
  // 6. AI and automation
  [{ learner: 2, career: 1 }, { learner: 1, clarity: 1 }, { business: 2, clarity: 1 }, { learner: 2, career: 1 }],
  // 7. Biggest obstacle
  [{ sos: 3 }, { clarity: 3 }, { career: 3 }, { learner: 3 }, { business: 3 }],
  // 8. Timeline
  [{ sos: 3 }, { clarity: 2, business: 1 }, { career: 2, learner: 1 }, { learner: 2 }],
];

export const QUESTION_COUNT = POINTS.length;

/** Answers are option indexes, one per question. Rejects anything that isn't a valid full set. */
export function isValidAnswers(answers: unknown): answers is number[] {
  if (!Array.isArray(answers) || answers.length !== QUESTION_COUNT) return false;
  return answers.every((a, q) => Number.isInteger(a) && a >= 0 && a < POINTS[q].length);
}

/** Highest total wins. A tie goes to the earliest profile in TIE_ORDER, which starts with the broadest one ("clarity"). */
const TIE_ORDER: ProfileKey[] = ["clarity", "sos", "career", "learner", "business"];

export function computeProfile(answers: number[]): ProfileKey {
  const totals: Record<ProfileKey, number> = { sos: 0, clarity: 0, career: 0, learner: 0, business: 0 };
  answers.forEach((option, q) => {
    for (const [profile, pts] of Object.entries(POINTS[q][option]) as [ProfileKey, number][]) totals[profile] += pts;
  });
  return TIE_ORDER.reduce((best, p) => (totals[p] > totals[best] ? p : best), TIE_ORDER[0]);
}
