# Live trial fixture

Intentionally faulty remove-item.ts removes the last item when the requested
value is absent (indexOf returns -1). remove-item-safe.ts is the clean control.
Both preserve the caller's array. Only these two tiny source files are sent.
This is a smoke test of each mode, not a model quality benchmark.
