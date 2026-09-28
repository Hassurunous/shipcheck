using System.Net.Http;

// Syntax fixture only, not a recommendation for production client lifecycle.
class Client {
    async System.Threading.Tasks.Task Example() {
        using var client = new HttpClient();
        await client.GetAsync("https://api.example.test/v1/users?q=alice");
        await client.DeleteAsync("https://api.example.test/v1/users/42");
    }
}
