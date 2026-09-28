import java.net.URI;
import java.net.http.HttpRequest;

class Client {
    HttpRequest example() {
        return HttpRequest.newBuilder(URI.create("https://api.example.test/v1/users?q=alice"))
            .GET().build();
    }
}
