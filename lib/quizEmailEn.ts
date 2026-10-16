// English result email for the NEXT YOU diagnostic. The Spanish flow enrolls people in a multi-email
// drip (lib/sequences.ts); an English drip doesn't exist yet, so English takers get this one email.
import { sendConfirmationEmail } from "@/lib/resend";
import { recordEmailSend } from "@/lib/emailTracking";
import { getPillarText } from "@/lib/i18n/content/diagnostic";
import { localizedPath } from "@/lib/i18n/routes";
import type { PillarKey } from "@/lib/diagnostic";

const INTRO: Record<PillarKey, string> = {
  mentalidad:
    "You've been thinking about your next version for a while, but doubt stops you before the first step. I want to tell you something I wish I'd heard years ago: you don't lack ability, you lack permission to start without having everything figured out.\n\nI spent two full years — 2019 to 2021 — in that same place. I'd learn a bit of technology, doubt myself, stop, and try again months later. The phrase that kept repeating in my head was: \"educator, Latina, woman, mom... impossible.\"\n\nI was wrong. And you may well be wrong about what you're telling yourself right now.",
  direccion:
    "You have plenty of talent and interests, and that is exactly what scatters you. Your priority now isn't to find more paths — it's to choose one and focus, even if it means letting other options go for now.\n\nMy own goal during the bootcamp was to land a job as a programmer before August 2021. I didn't hit that date exactly — I hit it a month later. If I had measured that process only by whether I arrived on time, I'd have called a failure something that completely changed the course of my career.",
  tecnologia:
    "You know technology is part of your next version, but it still intimidates you. The good news: you don't need to master it all at once, just take the first concrete step.\n\nI went from waitress to Software Engineer without a tech degree. The starting point wasn't a course — it was a weekend as a volunteer at GiveCamp Memphis, building a real website for a nonprofit in two days.",
  empleabilidad:
    "You're worth more than your resume or portfolio show today. Your priority now is to make visible what you already know how to do.\n\nMy first job in the United States was waiting tables, without speaking English. After that I cleaned houses, worked at a gym, in a school cafeteria. None of those jobs looked \"good\" on a traditional resume — but each one taught me something I ended up using in my tech career.",
  ingles:
    "Language has become the silent barrier holding back opportunities you already deserve. It's a technical obstacle, not a measure of your ability.\n\nI arrived in the United States without speaking English. My first job was waiting tables. A year later I passed a Personal Trainer certification entirely in English — the first big break in how I saw myself. Two years after arriving, I was already teaching Spanish in public schools.",
  productividad:
    "You're busy all the time, but you feel you're not moving toward where you want to go. Your challenge isn't doing more — it's organizing better what you already do.\n\nI did a six-month coding bootcamp while working full time as a teacher and raising three kids. I slept from 1am to 5am during that period. It wasn't balance — it was temporary, with a clear purpose and an end date.",
  bienestar:
    "You're chasing your next version at the limit of your energy. Without this pillar sorted out, any other change rests on a fragile base.\n\nIn 2016 my third child was born, prematurely. We spent a month with him in the hospital. Years later, during my bootcamp, I sustained six months of very little sleep — and although I don't regret the result, I wouldn't do it exactly the same way again. The body sends the bill.",
  comunidad:
    "You've tried to move forward alone again and again. It isn't a problem of effort — this process is simply easier to sustain with company.\n\nWhen we moved to the United States at the end of 2014, we landed in Florida with nothing. It was my sister, welcoming us in Memphis on December 31 of that year, who gave us the base to start over. Years later, it was a volunteer team — not a solitary course — that gave me the validation I needed to change careers.",
};

export async function sendEnglishQuizResult(contactId: string, email: string, name: string, pillar: PillarKey) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const archetype = getPillarText("en", pillar).archetype;
  const subject = `Your result: ${archetype}`;
  const greeting = name.trim() ? `Hi ${name.trim()},` : "Hi,";
  const unsubscribe = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&lang=en`;

  const text =
    `${greeting}\n\n` +
    `Your result on the NEXT YOU Diagnostic: ${archetype}.\n\n` +
    `${INTRO[pillar]}\n\n` +
    `If you'd like company on this, you can learn more about NEXT YOU here: ${siteUrl}${localizedPath("en", "nextYou")}\n\n` +
    `—\nCarla\n\nDon't want more emails? Unsubscribe here: ${unsubscribe}`;

  const resendId = await sendConfirmationEmail(email, subject, text);
  await recordEmailSend({ resendId, contactId, emailType: "transactional", subject });
}
