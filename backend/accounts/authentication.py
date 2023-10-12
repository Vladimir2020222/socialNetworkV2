from rest_framework.authentication import BaseAuthentication
from accounts.services import get_user_by_jwt


class JWTCOOKIESAuthentication(BaseAuthentication):
    def authenticate(self, request):
        user = get_user_by_jwt(request._request)
        if user:
            return user, request._request.COOKIES.get('jwt')
        return None, None
