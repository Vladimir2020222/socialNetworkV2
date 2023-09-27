from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.utils.http import urlsafe_base64_decode
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.services import get_user_by_jwt


User = get_user_model()


class PasswordChangeView(APIView):
    def post(self, request):
        user = get_user_by_jwt(request, raise_exception=True)
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not user.check_password(old_password):
            return Response({'success': False, 'reason': 'wrong password'})
        if old_password == new_password:
            return Response({'success': False, 'reason': 'new password can not match old'})
        user.set_password(new_password)
        user.save()
        return Response({'success': True})


class PasswordResetView(APIView):
    token_generator = default_token_generator
    from_email = settings.DEFAULT_FROM_EMAIL
    email_template_name = 'accounts/password_reset_email.html'
    subject_template_name = 'accounts/password_reset_subject.txt'
    extra_email_context = None

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response()  # returning the same email regardless requesting email attached to account or not
                               # because otherwise anyone can check if user with this email exists in the database
        form = PasswordResetForm({'email': email})
        if not form.is_valid():
            return Response()
        opts = {
            "use_https": self.request.is_secure(),
            "token_generator": self.token_generator,
            "from_email": self.from_email,
            "email_template_name": self.email_template_name,
            "subject_template_name": self.subject_template_name,
            "request": self.request,
            "extra_email_context": self.extra_email_context | {'url': request.data.get('url')},
        }
        form.save(**opts)
        return Response()


class PasswordResetConfirmView(APIView):
    token_generator = default_token_generator

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        user = self.get_user(request.data.get('uid'))
        if not user:
            return Response({'success': False, 'reason': 'invalid uid64'})
        if self.token_generator.check_token(user, token):
            new_password = request.data.get('password')
            user.set_password(new_password)
            user.save()
            return Response({'success': True})
        else:
            return Response({'success': False, 'reason': 'invalid token'})

    def get_user(self, uid):
        try:
            uid = urlsafe_base64_decode(uid).decode()
            return User.objects.get(pk=uid)
        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
            ValidationError
        ):
            return None
