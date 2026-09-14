export const faqIntro =
  "If yours is not here, the call is the fastest way to get a straight answer.";

export const faqs = [
  {
    question: "How is this different from running a scanner ourselves?",
    answer:
      "Generic scanners look for classic vulnerabilities (injection, unsafe eval) that AI-built agency apps rarely contain. They miss the patterns that actually recur on this stack. So I wrote my own rules for those patterns: request data written straight into a database write, a key exposed to the browser, a Stripe webhook that never verifies its signature. On top of that I check your Supabase configuration by hand, which no code scanner can read at all. That’s where the worst issue on this stack lives.",
  },
  {
    question: "Do you fix the issues, or just tell me about them?",
    answer:
      "You get a specific fix for every finding, not “this is broken.” A code snippet or a configuration change your team or your AI tool can apply directly. Once you’ve applied them, I re-check at no cost to confirm each one actually resolved the issue.",
  },
  {
    question: "What if nothing turns up?",
    answer:
      "That’s exactly what the report says: what was checked and what came back clean. I’d rather tell you it’s solid than manufacture findings to justify the fee. The report also includes the findings I reviewed and dismissed, so you can see a person went through it rather than taking my word for the result.",
  },
  {
    question: "Do I have to sign up for monitoring to get audited?",
    answer:
      "No. The audit stands on its own. The continuous layer is there if you want it once you’re shipping regularly, and it’s a one-time install with no retainer. There’s no requirement to take it, and I won’t chase you for it.",
  },
  {
    question: "Do you only work with Supabase?",
    answer:
      "Yes, deliberately. It’s the reason I find what generalists miss. The deepest check I run reads your database policies against your actual data model, and that’s specific to Supabase. If you’re on something else, tell me on the form and I’ll say honestly whether any of it transfers. I’d rather tell you no than guess on a stack I don’t know.",
  },
] as const;

/**
 * TODO: The pricing question is hidden for now and will be added back. Not
 * currently rendered — kept so the copy isn't lost. To restore it, move this
 * entry back into `faqs` above, between "Do I have to sign up for monitoring
 * to get audited?" and "Do you only work with Supabase?".
 */
export const hiddenPricingFaq = {
  question: "How much does it cost?",
  answer:
    "Priced per project by complexity for the audit, a one-time fee for the monitoring install, and a wholesale rate per client roster if you resell it. Never per seat, never per hour. I’ll give you real numbers on the call once I know the shape of the app.",
} as const;
