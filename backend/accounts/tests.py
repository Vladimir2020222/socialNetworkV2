import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.core import mail
from rest_framework import status
from common.tests import send_login_request

User = get_user_model()


class AuthenticationTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='user1', password='12345')

    def get_profile(self):
        profile_response = self.client.get(
            reverse('profile')
        )
        return json.loads(profile_response.content)

    def test_login(self):
        send_login_request(self.client)
        self.assertEqual(
            self.user.username,
            self.get_profile()['username'],
            'This test also may fail if profile api is not working properly'
        )

    def test_logout(self):
        send_login_request(self.client)
        self.client.post(reverse('logout'))
        profile_response = self.client.get(reverse('profile'))
        self.assertEqual(profile_response.content, b'')

    def test_signup(self):
        self.client.post(
            reverse('signup'),
            {'username': 'new_user', 'password': '12345'},
            content_type='application/json'
        )
        self.assertEqual(self.get_profile()['username'], 'new_user')

    def test_is_authenticated(self):
        self.assertEqual(self.client.get(reverse('is_authenticated')).content, b'false')
        send_login_request(self.client)
        self.assertEqual(self.client.get(reverse('is_authenticated')).content, b'true')


class SubscriptionsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user1 = User.objects.create_user(username='user1', password='12345')
        cls.user2 = User.objects.create_user(username='user2', password='12345')

    def send_subscribe_to_user2_request(self):
        return self.client.post(
            reverse('subscribe'),
            {'to': self.user2.pk},
            content_type='application/json'
        )

    def test_subscribe(self):
        send_login_request(self.client)  # logging in as user1
        self.send_subscribe_to_user2_request()
        self.assertIn(self.user1, self.user2.subscribers.all())

    def test_unsubscribe(self):
        send_login_request(self.client)  # logging in as user1
        self.send_subscribe_to_user2_request()
        self.client.post(
            reverse('unsubscribe'),
            {'from': self.user2.pk},
            content_type='application/json'
        )
        self.assertNotIn(self.user1, self.user2.subscribers.all())

    def test_restrict_unauthorized_user_requests(self):
        subscribe_request = self.send_subscribe_to_user2_request()
        self.assertEqual(subscribe_request.status_code, status.HTTP_401_UNAUTHORIZED)

    def is_subscribed(self):
        send_login_request(self.client)


class ResetAndChangePasswordTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='user1', password='12345', email='test@gmail.com')

    def test_change_password(self):
        send_login_request(self.client)
        self.client.post(
            reverse('password_change'),
            {'old_password': '12345', 'new_password': '11111'},
            content_type='application/json'
        )
        user = User.objects.get(pk=self.user.pk)
        self.assertTrue(user.check_password('11111'))

    def send_reset_password_request(self):
        self.client.post(
            reverse('password_reset'),
            {'email': 'test@gmail.com', 'confirm_reset_password_url': 'http://test.domain.com'},
            content_type='application/json'
        )

    def test_reset_password_sends_email(self):
        self.send_reset_password_request()
        self.assertEqual(len(mail.outbox), 1)

    def test_reset_password(self):
        self.send_reset_password_request()
        _, uid, token = mail.outbox[0].message().as_string().rsplit('/', 2)
        token = token[:-1]
        self.client.post(
            reverse('password_reset_confirm'),
            {'token': token, 'uid': uid, 'password': 'new_password'},
            content_type='application/json'
        )
        self.assertTrue(User.objects.get(pk=self.user.pk).check_password('new_password'))


class ChangeEmailTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='user1', password='12345')

    def send_change_email_request(self):
        self.client.post(
            reverse('change_email'),
            {'email': 'test_email@gmail.com', 'confirm_email_url': 'confirm', 'site_name': 'test_site'},
            content_type='application/json'
        )

    def test_change_email_sends_email(self):
        send_login_request(self.client)
        self.send_change_email_request()
        self.assertEqual(len(mail.outbox), 1)

    def test_change_email(self):
        send_login_request(self.client)
        self.send_change_email_request()
        body = mail.outbox[0].body
        token = body.split('confirm/')[1]
        self.client.post(
            reverse('change_email_confirm'),
            {'token': token},
            content_type='application/json',
        )
        self.assertEqual(User.objects.get(pk=self.user.pk).email, 'test_email@gmail.com')
