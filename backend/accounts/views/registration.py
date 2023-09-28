from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer, UserAllDataSerializer
from accounts.services import generate_new_jwt, get_user_by_jwt, subscribe, unsubscribe, is_subscribed_to


class SignUpAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False})
        user = serializer.save()
        jwt = generate_new_jwt(user.pk)
        response = Response({'success': True})
        response.set_cookie(key='jwt', value=jwt, httponly=True, samesite='none', secure=True)
        return response


class SignInAPIView(APIView):
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


class ProfileView(APIView):
    def get(self, request):
        serializer = UserAllDataSerializer(get_user_by_jwt(request))
        return Response(serializer.data)


class IsLoggedInAPIView(APIView):
    def get(self, request):
        user = get_user_by_jwt(request)
        return Response(bool(user))


class ChangeUserAvaAPIView(APIView):
    def patch(self, request):
        file = request.data.get('ava')
        user = get_user_by_jwt(request)
        if (not file) or (not user):
            return Response({'success': False})
        user.ava = file
        user.save()
        return Response({'success': True})
