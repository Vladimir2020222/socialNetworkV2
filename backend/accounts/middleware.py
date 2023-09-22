from django.contrib.auth.middleware import get_user as get_user_by_session, \
    AuthenticationMiddleware as BaseAuthenticationMiddleware
from django.contrib.auth.models import AnonymousUser
from django.utils.functional import SimpleLazyObject

from accounts.services import get_user_by_jwt


def get_user(request):
    user = get_user_by_session(request)
    if user.is_authenticated:
        return user
    user = get_user_by_jwt(request) or AnonymousUser()
    request._cached_user = user
    return user


class AuthenticationMiddleware(BaseAuthenticationMiddleware):  # inheritance from auth.AuthenticationMiddleware is
    def __init__(self, get_response):                          # necessary because if admin in INSTALLED_APPS django
        super().__init__(get_response)                         # checks if auth.AuthenticationMiddleware (or its
        self.get_response = get_response                       # subclass) is there too, and raises an Exception if not

    def __call__(self, request):
        request.user = SimpleLazyObject(lambda: get_user(request))
        return self.get_response(request)
