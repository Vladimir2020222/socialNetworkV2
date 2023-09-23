import datetime

from django.contrib.auth.models import AbstractUser
from django.db import models


def ava_upload_to(instance, filename):
    upload_to = f'users/avas/%Y/%m/%d/{instance.pk}/{filename}'
    return datetime.datetime.now().strftime(upload_to)


class User(AbstractUser):
    ava = models.ImageField(upload_to=ava_upload_to)
    subscribers = models.ManyToManyField('User', related_name='subscriptions', related_query_name='subscription')
