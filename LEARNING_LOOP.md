# Development + Understanding Loop

This is the core workflow:

1. Build: implement a feature or fix.
2. Review: run quality checks and read drift/reasoning.
3. Understand: ask follow-up questions until the logic is clear.
4. Improve: apply targeted changes based on what was learned.
5. Capture: store prompt and code delta in wit.
6. Repeat: keep tightening quality and understanding.

## Why this works

- It improves code quality over time.
- It improves engineering judgment over time.
- It creates an auditable trail of decisions, not just outputs.

## Session Routine

```bash
wit new <slug> <tags...> --goal "one clear objective"
wit prompt "exact prompt sent"
# implement + refine
wit review --model llama3.2:3b
wit score
wit explain <slug>
wit commit
```

## Mindset

Use scores and drift as feedback, not as a grade.

- If drift is high: clarify scope and acceptance criteria.
- If review findings are weak: ask deeper follow-up questions.
- If reasoning is unclear: request examples and edge-case walkthroughs.

The right move is the one you can explain and maintain later.