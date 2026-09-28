import requests


def example():
    with requests.Session() as session:
        return session.get('https://api.example.test/v1/users', params={'q': 'alice'})
