// Syntax fixture for Shipcheck; auditing does not execute this function.
export async function search(): Promise<Response> {
  return fetch('https://api.example.test/v1/users?q=alice' as const);
}
