export async function listUsers() {
  const response = await fetch('https://api.example.test/usres');
  return response.json();
}
