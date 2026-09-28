# Syntax fixture for Shipcheck; auditing does not import Requests or run this file.
import requests as http


def search():
    return http.get('https://api.example.test/v1/users', params={'q': 'alice'})


def remove():
    return http.request('DELETE', 'https://api.example.test/v1/users/42')
