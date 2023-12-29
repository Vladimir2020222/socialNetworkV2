import datetime

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()


def get_user_by_jwt(request: HttpRequest, *, raise_exception=False):
    try:
        token = request.COOKIES.get(settings.JWT_AUTH_COOKIES_NAME)
        try:
            if token is None:
                raise AuthenticationFailed('jwt_auth_token is not on COOKIES')
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
    except jwt.PyJWTError as e:
        if raise_exception:
            raise e
        return None


def generate_new_jwt_auth(user_id):
    payload = {
        'id': user_id,
        'exp': datetime.datetime.now() + datetime.timedelta(weeks=52),
        'iat': datetime.datetime.now()
    }
    return jwt.encode(payload, settings.SECRET_KEY, 'HS256')


def generate_new_jwt_for_email_changing(email, user):
    payload = {
        'email': email,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'exp': datetime.datetime.now() + datetime.timedelta(weeks=1),
        'iat': datetime.datetime.now()
    }
    return jwt.encode(payload, settings.SECRET_KEY, 'HS256')


def get_user_and_email_by_jwt(token):
    payload = jwt.decode(token, settings.SECRET_KEY, ['HS256'])
    uid, email = payload.get('uid'), payload.get('email')
    user_id = urlsafe_base64_decode(uid).decode()
    user = User.objects.get(pk=user_id)
    return user, email
