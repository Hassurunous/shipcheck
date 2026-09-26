/** Format the bootstrap status without inspecting or modifying the target. */
export function formatStatus(args: readonly string[] = []): string {
  const target = args[0] ?? ".";
  return `Shipcheck v0.1\n\nTarget: ${target}\nStatus: ready`;
}
