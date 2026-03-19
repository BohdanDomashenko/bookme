---
trigger: always_on
---

Use strict typization, but only when typescript don't identify types by itself.
Example const myNumber = 1; - no need to manually define type, while in thit case let myNumber: number; - you should define type. Same for functions, hooks and so on.
Prefer functions over arrow functions. Never use any type definition.