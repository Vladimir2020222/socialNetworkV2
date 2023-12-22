from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template import loader
from django.utils.decorators import method_decorator
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin, RetrieveModelMixin
from rest_framework.response import Response

from accounts.serializers import UserSerializer
from accounts.services import generate_new_jwt_for_email_changing, get_user_and_email_by_jwt, remove_profile_cache, \
    set_profile_cache
from common.decorators import per_user_cache_page

User = get_user_model()


class ProfileAPIView(RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    serializer_class = UserSerializer

    @method_decorator(per_user_cache_page(60 * 15))
    def get(self, request):
        if request.user.is_anonymous:
            return Response(None)
        return self.retrieve(request)

    def patch(self, request):
        if request.user.is_anonymous:
            return Response(None)
        remove_profile_cache(request)
        response = self.update(request, partial=True)
        set_profile_cache(request, response)
        return response

    def get_object(self):
        return self.request.user


class ChangeEmailAPIView(GenericAPIView):
    from_email = settings.DEFAULT_FROM_EMAIL
    email_template_name = 'accounts/change_email.html'
    subject_template_name = 'accounts/change_email_subject.txt'

    def post(self, request):
        email = request.data.get('email')
        confirm_email_url = request.data.get('confirm_email_url')
        site_name = request.data.get('site_name')
        user = request.user

        jwt = generate_new_jwt_for_email_changing(email, user)

        context = {
            'confirm_email_url': confirm_email_url,
            'site_name': site_name,
            'jwt': jwt,
            'request': request
        }
        subject = loader.render_to_string('accounts/change_email_subject.txt', context, request)
        message = loader.render_to_string('accounts/change_email.html', context, request)
        send_mail(subject, message, self.from_email, [email])
        return Response()


class ConfirmChangeEmailAPIView(RetrieveModelMixin, GenericAPIView):
    token_generator = default_token_generator
    serializer_class = UserSerializer

    def post(self, request):
        user, email = get_user_and_email_by_jwt(request.data.get('token').encode())
        self.user = user
        user.email = email
        user.save()
        return self.retrieve(request)

    def get_object(self):
        return self.user
