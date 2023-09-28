import datetime

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()


def get_user_by_jwt(request: HttpRequest, *, raise_exception=False):
    token = request.COOKIES.get('jwt')
    try:
        if token is None:
            raise AuthenticationFailed('jwl token is not on COOKIES')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, ['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('ExpiredSignatureError')
        user = User.objects.get(pk=payload['id'])
    except (AuthenticationFailed, User.DoesNotExist) as e:
        if raise_exception:
            raise e
        return None
    return user


def generate_new_jwt(user_id):
    payload = {
        'id': user_id,
        'exp': datetime.datetime.now() + datetime.timedelta(weeks=52),
        'iat': datetime.datetime.now()
    }
    return jwt.encode(payload, settings.SECRET_KEY, 'HS256')


def subscribe(user, to: int):
    to = User.objects.get(pk=to)
    user.subscribe(to)


def unsubscribe(user, from_: int):
    from_ = User.objects.get(pk=from_)
    user.unsubscribe(from_)


def is_subscribed_to(user, to: int):
    to = User.objects.get(pk=to)
    return user.is_subscribed_to(to)
