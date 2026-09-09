export type FitQuestion = {
  id: "role" | "builtWith" | "backend" | "stage";
  label: string;
  options: readonly string[];
};

export const fitQuestions: readonly FitQuestion[] = [
  {
    id: "role",
    label: "What best describes you",
    options: ["Agency", "Freelancer", "In-house team", "Side project"],
  },
  {
    id: "builtWith",
    label: "What did you build it with",
    options: [
      "Cursor",
      "Claude",
      "Lovable",
      "Bolt",
      "Codex",
      "Hand-written",
      "Other",
    ],
  },
  {
    id: "backend",
    label: "What’s the backend",
    options: ["Supabase", "Firebase", "Custom", "Not sure"],
  },
  {
    id: "stage",
    label: "Where are you now",
    options: [
      "Shipping to a client soon",
      "Live already",
      "Launching in a few weeks",
      "Exploring",
    ],
  },
] as const;

export type FitAnswers = Partial<Record<FitQuestion["id"], string>>;

/**
 * Answers that rule someone out, straight from the copy above the form.
 *
 * - Backend: the page states plainly that non-Supabase builds aren't a fit.
 *   "Not sure" still qualifies — plenty of people don't know what Lovable
 *   provisioned for them, and it's often Supabase.
 * - Role: a side project has no client to lose and no budget to protect.
 *
 * Nothing about the build tool or the stage disqualifies anyone.
 */
const disqualifying: Partial<Record<FitQuestion["id"], readonly string[]>> = {
  backend: ["Firebase", "Custom"],
  role: ["Side project"],
};

export function isQualified(answers: FitAnswers): boolean {
  return fitQuestions.every((q) => {
    const answer = answers[q.id];
    if (!answer) return false;
    return !disqualifying[q.id]?.includes(answer);
  });
}

/** Shown instead of the calendar when someone doesn't qualify. */
export function declineReason(answers: FitAnswers): string {
  if (answers.backend && disqualifying.backend?.includes(answers.backend)) {
    return "I only work on Supabase builds. That focus is the reason I find what generalists miss. On a different backend I’d be guessing, and you’d be paying for it.";
  }
  return "I work with teams who have a client on the line. For a side project the honest answer is that an audit isn’t worth the money yet.";
}

export const calLink = process.env.NEXT_PUBLIC_CAL_LINK;
