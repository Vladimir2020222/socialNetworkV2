from django.contrib.auth import get_user_model
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import RetrieveModelMixin

from .registration import SignInAPIView, SignOutAPIView, SignUpAPIView, IsLoggedInAPIView
from .profile import ProfileAPIView, ConfirmChangeEmailAPIView, ChangeEmailAPIView
from .subscriptions import SubscribeAPIView, UnsubscribeAPIView, IsSubscribedAPIView
from .passwords import PasswordChangeAPIView, PasswordResetAPIView, PasswordResetConfirmAPIView
from ..serializers import UserSerializer

User = get_user_model()

__all__ = [
    'SignInAPIView',
    'SignOutAPIView',
    'SignUpAPIView',
    'IsLoggedInAPIView',
    'ProfileAPIView',
    'SubscribeAPIView',
    'UnsubscribeAPIView',
    'IsSubscribedAPIView',
    'PasswordChangeAPIView',
    'PasswordResetAPIView',
    'PasswordResetConfirmAPIView',
    'ConfirmChangeEmailAPIView',
    'ChangeEmailAPIView',
    'UserAPIView'
]


class UserAPIView(GenericAPIView, RetrieveModelMixin):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get(self, request, pk):
        return self.retrieve(request)
