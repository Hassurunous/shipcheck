package fixtures

import "net/http"

// Syntax fixture only; Shipcheck does not execute it.
func example() {
    http.Get("https://api.example.test/v1/users?q=alice")
    http.NewRequest(http.MethodDelete, "https://api.example.test/v1/users/42", nil)
}
