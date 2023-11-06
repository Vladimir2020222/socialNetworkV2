from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import BaseAuthentication
from accounts.services import get_user_by_jwt


class JWTCOOKIESAuthentication(BaseAuthentication):
    def authenticate(self, request):
        user = get_user_by_jwt(request._request)
        if user:
            return user or AnonymousUser(), request._request.COOKIES.get('jwt')
        return AnonymousUser(), None
