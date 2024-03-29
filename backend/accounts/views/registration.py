from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer
from accounts.services import generate_new_jwt_auth, remove_profile_cache


class SignUpAPIView(RetrieveModelMixin, GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False})
        self.user = serializer.save()
        jwt = generate_new_jwt_auth(self.user.pk)
        response = self.retrieve(request)
        response.set_cookie(
            key=settings.JWT_AUTH_COOKIES_NAME,
            value=jwt,
            httponly=True,
            samesite='none',
            secure=request.is_secure()
        )
        return response

    def get_object(self):
        return self.user


class SignInAPIView(RetrieveModelMixin, GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request):
        username, password = request.data.get('username'), request.data.get('password')
        user = self.user = authenticate(username=username, password=password)
        if user is None:
            return Response({'success': False})
        jwt = generate_new_jwt_auth(user.pk)
        response = self.retrieve(request)
        response.set_cookie(
            key=settings.JWT_AUTH_COOKIES_NAME,
            value=jwt,
            httponly=True,
            samesite='none',
            secure=request.is_secure()
        )
        return response

    def get_object(self):
        return self.user


class SignOutAPIView(APIView):
    def post(self, request):
        remove_profile_cache(request)
        response = Response({'success': True})
        response.delete_cookie(key=settings.JWT_AUTH_COOKIES_NAME, samesite='none')
        return response


class IsAuthenticatedAPIView(APIView):
    def get(self, request):
        return Response(request.user.is_authenticated)
