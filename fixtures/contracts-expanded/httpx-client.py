import httpx


def example():
    with httpx.Client() as client:
        return client.get('https://api.example.test/v1/users', params={'q': 'alice'})
