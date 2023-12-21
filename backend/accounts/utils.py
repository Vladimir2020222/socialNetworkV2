from functools import wraps

from rest_framework import status
from rest_framework.response import Response


def api_login_required(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        if request.user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return view(request, *args, **kwargs)
    return wrapper
