from django.contrib.auth import authenticate
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer
from accounts.services import generate_new_jwt, get_user_by_jwt
from accounts.views.mixins import GetUserMixin


class SignUpAPIView(GenericAPIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False})
        user = serializer.save()
        jwt = generate_new_jwt(user.pk)
        response = Response({'success': True})
        response.set_cookie(key='jwt', value=jwt, httponly=True, samesite='none', secure=True)
        return response


class SignInAPIView(GetUserMixin, GenericAPIView):
    def post(self, request):
        username, password = request.data.get('username'), request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'success': False})
        jwt = generate_new_jwt(user.pk)
        response = Response({'success': True})
        response.set_cookie(key='jwt', value=jwt, httponly=True, samesite='none', secure=True)
        return response


class SignOutAPIView(APIView):
    def post(self, request):
        response = Response({'success': True})
        response.delete_cookie(key='jwt', samesite='none')
        return response


class IsLoggedInAPIView(GetUserMixin, GenericAPIView):
    def get(self, request):
        return Response(bool(self.get_object()))
