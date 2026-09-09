/** One sentence per line. */
export const checksIntro = [
  "Same models, same training data, same stack.",
  "The mistakes repeat, and that’s what makes them findable.",
] as const;

export const checks = [
  {
    question: "Is your database enforcing what you think it is?",
    body: "The deepest check and the one nothing else does. I read your policies against your actual data model and test them as each of your roles.",
  },
  {
    question:
      "Is your code written the way AI writes it when nobody asks for security?",
    body: "Static analysis against rules I wrote for this stack, not the generic ruleset. Keys ending up in the browser bundle, request data written straight into the database.",
  },
  {
    question: "Can it be broken into from outside, logged in as a real user?",
    body: "Runtime testing against the deployed app, authenticated as each role you’ve defined, not a scan of the front door.",
  },
  {
    question: "Is anything secret in the open?",
    body: "Credentials committed to the repository, service keys and AI keys readable by any visitor, environment variables exposed to the client.",
  },
  {
    question: "Is anything shipping with a known vulnerability?",
    body: "Your actual dependency manifest checked against published vulnerabilities, the ones that were fine when you shipped and aren’t now.",
  },
  {
    question: "Did a person verify all of it?",
    body: "Every finding reproduced by hand before it reaches you, false positives removed, and re-ranked by what it would actually cost you. You get a short list of real problems, each with proof.",
  },
] as const;

/** Not currently rendered — kept so the copy isn't lost. */
export const checksClosing =
  "The list of things that can break on this stack isn’t secret. Whether your policies are correct on your data model is a different question, and no tool answers it.";
