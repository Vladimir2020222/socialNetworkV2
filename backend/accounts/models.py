import datetime

from django.contrib.auth.models import AbstractUser
from django.db import models


def ava_upload_to(instance, filename):
    upload_to = f'users/avas/%Y/%m/%d/{instance.pk}/{filename}'
    return datetime.datetime.now().strftime(upload_to)


class User(AbstractUser):
    ava = models.ImageField(upload_to=ava_upload_to, default='users/avas/default.png')
    subscribers = models.ManyToManyField('User', related_name='subscriptions', related_query_name='subscription')

    def subscribe(self, to):
        assert self != to, 'it is impossible to subscribe to yourself'
        if self.is_subscribed_to(to):
            return
        to.subscribers.add(self)

    def unsubscribe(self, from_):
        from_.subscribers.remove(self)

    def is_subscribed_to(self, to):
        return to.subscribers.contains(self)
