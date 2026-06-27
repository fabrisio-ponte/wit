# skill-tracker

A git-based log of prompt and code quality over time.

## workflow
```
wit new <slug> [tags...]   # start a session
wit commit                 # score + commit
wit log                    # view history
wit status                 # current open session
```

## session structure
```
sessions/YYYY-MM-DD_<slug>/
  prompt.md        — the exact prompt sent
  output_raw.*     — claude's output, unedited
  output_final.*   — what you actually kept
  meta.json        — scores, tags, timing
  reflection.md    — what worked / failed
```
