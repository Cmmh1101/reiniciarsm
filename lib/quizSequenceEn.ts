// English follow-up for the NEXT YOU 8-pillar diagnostic: a result email now, then two more (day 3 and day 7),
// the same timing as the Spanish sequence. The community paragraphs describe the community as it works today
// (short lessons, one small task, live coaching twice a week) rather than translating the older Spanish wording.
import type { SequenceStep } from "@/lib/sequences";
import { getPillarText } from "@/lib/i18n/content/diagnostic";
import { localizedPath } from "@/lib/i18n/routes";
import type { PillarKey } from "@/lib/diagnostic";

const INTRO: Record<PillarKey, string> = {
  mentalidad:
    "You've been thinking about your next version for a while, but doubt stops you before the first step. I want to tell you something I wish I'd heard years ago: you don't lack ability, you lack permission to start without having everything figured out.\n\nI spent two full years — 2019 to 2021 — in that same place. I'd learn a bit of technology, doubt myself, stop, and try again months later. The phrase that kept repeating in my head was: \"educator, Latina, woman, mom... impossible.\"\n\nI was wrong. And you may well be wrong about what you're telling yourself right now.\n\nIn the coming days I'll share what broke that cycle for me, and how to apply it to your situation.",
  direccion:
    "You have plenty of talent and interests, and that is exactly what scatters you. Your priority now isn't to find more paths — it's to choose one and focus, even if it means letting other options go for now.\n\nMy own goal during the bootcamp was to land a job as a programmer before August 2021. I didn't hit that date exactly — I hit it a month later. If I had measured that process only by whether I arrived on time, I'd have called a failure something that completely changed the course of my career.\n\nIn the coming days I'll tell you how I chose a single direction when it felt like I had too many options.",
  tecnologia:
    "You know technology is part of your next version, but it still intimidates you. The good news: you don't need to master it all at once, just take the first concrete step.\n\nI went from waitress to Software Engineer without a tech degree. The starting point wasn't a course — it was a weekend as a volunteer at GiveCamp Memphis, building a real website for a nonprofit in two days.\n\nIn the coming days I'll tell you how to find your own version of that first project.",
  empleabilidad:
    "You're worth more than your resume or portfolio show today. Your priority now is to make visible what you already know how to do.\n\nMy first job in the United States was waiting tables, without speaking English. After that I cleaned houses, worked at a gym, in a school cafeteria. None of those jobs looked \"good\" on a traditional resume — but each one taught me something I ended up using in my tech career.\n\nIn the coming days I'll tell you how I learned to make that experience visible.",
  ingles:
    "Language has become the silent barrier holding back opportunities you already deserve. It's a technical obstacle, not a measure of your ability.\n\nI arrived in the United States without speaking English. My first job was waiting tables. A year later I passed a Personal Trainer certification entirely in English — the first big break in how I saw myself. Two years after arriving, I was already teaching Spanish in public schools.\n\nIn the coming days I'll tell you what was different in those two years.",
  productividad:
    "You're busy all the time, but you feel you're not moving toward where you want to go. Your challenge isn't doing more — it's organizing better what you already do.\n\nI did a six-month coding bootcamp while working full time as a teacher and raising three kids. I slept from 1am to 5am during that period. It wasn't balance — it was temporary, with a clear purpose and an end date.\n\nIn the coming days I'll share the 3 permissions I had to give myself to sustain it.",
  bienestar:
    "You're chasing your next version at the limit of your energy. Without this pillar sorted out, any other change rests on a fragile base.\n\nIn 2016 my third child was born, prematurely. We spent a month with him in the hospital. Years later, during my bootcamp, I sustained six months of very little sleep — and although I don't regret the result, I wouldn't do it exactly the same way again. The body sends the bill.\n\nIn the coming days I'll tell you what I learned about sustaining change without burning out in the process.",
  comunidad:
    "You've tried to move forward alone again and again. It isn't a problem of effort — this process is simply easier to sustain with company.\n\nWhen we moved to the United States at the end of 2014, we landed in Florida with nothing. It was my sister, welcoming us in Memphis on December 31 of that year, who gave us the base to start over. Years later, it was a volunteer team — not a solitary course — that gave me the validation I needed to change careers.\n\nIn the coming days I'll tell you why having company changed everything.",
};

const FOLLOW_UPS: Record<PillarKey, { subject2: string; body2: string; subject3: string; body3: string }> = {
  mentalidad: {
    subject2: "What broke my cycle of doubt (it wasn't feeling less afraid)",
    body2:
      "What broke my cycle of doubt wasn't feeling less afraid. It was a weekend as a volunteer at GiveCamp Memphis, building a website for a nonprofit. I ended up leading that team. That real result — not a promise, something I could see finished — was the first proof that it was possible.\n\nIf you're in the cycle of \"I try, I doubt, I stop, I try again,\" the way out isn't waiting to feel more confident. It's finding a small, real project where you can see evidence that you can — not one more promise, something finished.\n\nWhat could that small proof be for you this week?",
    subject3: "You don't have to break this cycle alone",
    body3:
      "Something I learned after my own cycles of doubt: they break faster with company than alone.\n\nThat's how the NEXT YOU community works — one step at a time: a short lesson on the belief that's holding you back, one small task, and live coaching twice a week where you can bring what got you stuck.\n\nIf you feel it's time to stop trying in isolation, the door is open: [Join the NEXT YOU community →]",
  },
  direccion: {
    subject2: "How I chose a path when I had too many options",
    body2:
      "When I started exploring technology, there were too many possible paths: development, design, automation, project management. It wasn't researching more that gave me clarity — it was choosing ONE concrete direction, even without being certain it was \"the right one,\" and committing to it long enough to find out if it worked.\n\nDirection isn't found by thinking more. It's found by acting on a single path long enough to have real evidence.\n\nWhat is the ONE direction you could commit to for the next 4 weeks, even if you're not 100% sure?",
    subject3: "A map for your next step, not your whole life",
    body3:
      "You don't need a map of your whole life. You need the next concrete step.\n\nThat's how NEXT YOU works: one step at a time, with short lessons, one small task each, and live coaching twice a week where you can bring the doubt when it comes back — because it will come back, and that's okay.\n\nIf you want to stop chasing every path at once: [Join the NEXT YOU community →]",
  },
  tecnologia: {
    subject2: "You don't need one more course, you need a real project",
    body2:
      "Most people who get stuck with technology don't lack information — they have too much, from too many different courses, without ever building something real and finished.\n\nWhat gave me confidence wasn't another course. It was building something small and real: a weekend website for a nonprofit. Nobody asked me for a degree or a certification — just a result they could see.\n\nWhat's the smallest, most real project you could build this week, even if it isn't perfect?",
    subject3: "Technology without fear, with real support",
    body3:
      "In NEXT YOU you can start from literally zero — no assumption that you already know how to code, no technical language that confuses more than it helps. Short lessons, one small task each, and live coaching where you can ask anything.\n\nIf you want to lose the fear of technology with small, guided steps instead of trying alone in front of a thousand different tutorials: [Join the NEXT YOU community →]",
  },
  empleabilidad: {
    subject2: "How I made experience that \"didn't qualify\" visible",
    body2:
      "For a long time I thought my experience — waitress, cleaning, school cafeteria — didn't count as anything \"professional.\" I was wrong. Each of those jobs showed something real: adaptability, resilience, the ability to learn fast under pressure.\n\nThe problem wasn't my experience. It was how I was telling it — or not telling it at all.\n\nTry this exercise: take your current job (or the last one you had) and write one sentence about a concrete skill it shows, beyond the job title.",
    subject3: "Making your experience visible, with company",
    body3:
      "In NEXT YOU we work on making what you already know how to do visible, one small task at a time — how you describe your experience, your professional profile, your next application — with live coaching where you can bring real examples.\n\nIf you want to stop feeling that your experience is invisible to the market: [Join the NEXT YOU community →]",
  },
  ingles: {
    subject2: "Language doesn't measure your ability, it measures your practice",
    body2:
      "Passing that English certification didn't mean I suddenly mastered the language perfectly. It meant I stopped waiting to feel ready to use it, and started practicing in real situations, mistakes included.\n\nProfessional English isn't learned by avoiding uncomfortable situations. It's learned by going through them, one imperfect conversation at a time.\n\nWhat's one conversation in English you've been putting off this week?",
    subject3: "Real English practice, not another grammar app",
    body3:
      "In NEXT YOU the live coaching alternates languages — Spanish on Tuesdays and English on Thursdays — so Thursday is a real place to practice professional English with other people in your situation, mistakes included.\n\nIf you want to stop postponing the opportunities you could already take: [Join the NEXT YOU community →]",
  },
  productividad: {
    subject2: "The 3 permissions that sustained my most intense routine",
    body2:
      "Sustaining that pace wasn't just discipline. It was giving myself concrete permissions: permission to not know everything before moving forward, permission to ask for help instead of trying completely alone, and permission to redefine what \"enough\" means on a busy day.\n\nTime doesn't just appear — it's built with temporary, uncomfortable decisions, not with magical extra hours in the day.\n\nWhat would you be willing to move temporarily this week to make progress on what really matters?",
    subject3: "A system, not more willpower",
    body3:
      "In NEXT YOU, productivity isn't \"try harder\" — it's one small task a week, in a clear order, so your reinvention gets real space without sacrificing work, family or rest.\n\nIf you want to stop being busy without moving forward: [Join the NEXT YOU community →]",
  },
  bienestar: {
    subject2: "Wellbeing isn't a luxury apart from the method",
    body2:
      "For a long time I treated rest as something I'd \"earn\" after getting everything else done. It was the other way around: the periods when I really made progress were the ones with a clear limit on how much sacrifice I was willing to sustain, and for how long.\n\nIf you're pushing with no defined limits right now, the question isn't \"how do I hold out longer?\" — it's \"what limit do I need to put on this to sustain it?\"",
    subject3: "You don't have to carry this alone, exhausted",
    body3:
      "In NEXT YOU the pace is built to be sustainable: one short lesson and one small task a week, not a pile of homework. Restarting your career shouldn't cost you your health.\n\nIf you feel you're at your limit: [Join the NEXT YOU community →]",
  },
  comunidad: {
    subject2: "What I achieved with a team that I couldn't alone",
    body2:
      "I spent two years trying to learn technology completely alone. I'd doubt, stop, try again. What finally worked was a weekend with a team — GiveCamp Memphis — building something real together with another person, not one more solo attempt in front of a screen.\n\nIt's not that you need someone to do the work for you. It's that the same effort, with company, holds up differently.\n\nWho could you share your next step with this week, instead of keeping it to yourself?",
    subject3: "You won't restart alone",
    body3:
      "NEXT YOU exists for exactly this: a community where you share your progress each week, ask what got you stuck, and meet live twice a week — so every step, big or small, is shared with someone instead of carried in silence.\n\nIf you're ready to stop trying in isolation: [Join the NEXT YOU community →]",
  },
};

export function getQuizSequenceEn(pillar: PillarKey): SequenceStep[] {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const communityUrl = `${site}${localizedPath("en", "nextYou")}`;
  const archetype = getPillarText("en", pillar).archetype;
  const content = FOLLOW_UPS[pillar];
  const greeting = (name: string) => (name.trim() ? `Hi ${name.trim()},` : "Hi,");
  const footer = (unsubscribeUrl: string) => `\n\n—\nCarla\n\nDon't want more emails? Unsubscribe here: ${unsubscribeUrl}`;

  return [
    {
      delayDays: 0,
      subject: `Your result: ${archetype}`,
      body: (name, unsubscribeUrl) => `${greeting(name)}\n\nYour result on the NEXT YOU Diagnostic: ${archetype}.\n\n${INTRO[pillar]}${footer(unsubscribeUrl)}`,
    },
    {
      delayDays: 3,
      subject: content.subject2,
      body: (name, unsubscribeUrl) => `${greeting(name)}\n\n${content.body2}${footer(unsubscribeUrl)}`,
    },
    {
      delayDays: 4,
      subject: content.subject3,
      body: (name, unsubscribeUrl) =>
        `${greeting(name)}\n\n${content.body3.replace("[Join the NEXT YOU community →]", `Join the NEXT YOU community → ${communityUrl}`)}${footer(unsubscribeUrl)}`,
    },
  ];
}
