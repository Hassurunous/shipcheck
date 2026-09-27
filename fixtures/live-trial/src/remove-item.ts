export function removeItem(items: string[], value: string): string[] {
  const result = [...items];
  const index = result.indexOf(value);
  result.splice(index, 1);
  return result;
}
