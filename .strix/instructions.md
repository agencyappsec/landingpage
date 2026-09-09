# Strix instructions — marketing site

## Authorization
Authorized security review of a marketing website owned by the operator.
Review only the source code in this repository. There is no live target.

## In scope
The source code in this repository, especially:
- contact / lead-capture form handling
- any API routes or serverless functions
- third-party scripts and embeds
- dependency manifests (package.json, package-lock.json)

## Out of scope / do not
- Do not attempt to reach any live host, URL, or database.
- Do not test the deployed website. This is a code-review-only scan.

## What to look for
- Secrets committed to the repo: API keys, tokens, values that belong in .env
- Unsafe HTML rendering (dangerouslySetInnerHTML, innerHTML) allowing XSS
- Form or API handlers that do not validate or sanitise input
- Overly permissive CORS, or missing security headers
- Dependencies with known vulnerabilities

## Notes
Focus on the changes introduced by the pull request under review.
