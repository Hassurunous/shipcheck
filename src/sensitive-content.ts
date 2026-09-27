/** Conservative heuristics, not a guarantee that all secrets are detected. */
export const sensitiveName=/(?:^|[._-])(?:secrets?|credentials?|tokens?|passwords?|private|keys?)(?:[._-]|$)/i;
export const sensitiveContent=/-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|\bsk-[A-Za-z0-9_-]{16,}|\bAKIA[A-Z0-9]{16}\b|(?:api[_-]?key|password|secret|token)\s*[:=]\s*["'][^"'\r\n]{8,}["']/i;
