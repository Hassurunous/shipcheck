export function removeItemSafe(items: string[], value: string): string[] {
  const result = [...items];
  const index = result.indexOf(value);
  if (index >= 0) result.splice(index, 1);
  return result;
}
