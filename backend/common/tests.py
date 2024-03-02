from django.urls import reverse


def send_login_request(client, username='user1', password='12345'):
    return client.post(
        reverse('login'),
        {'username': username, 'password': password},
        content_type='application/json'
    )
