from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer, UserAllDataSerializer
from accounts.services import generate_new_jwt, get_user_by_jwt
from backend.utils import transform_dict_keys_to_camel_case


class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.POST)
        if not serializer.is_valid():
            return Response({'success': False})
        user = serializer.save()
        jwt = generate_new_jwt(user.pk)
        response = Response({'success': True})
        response.set_cookie(key='jwt', value=jwt)
        return response


class SignInView(APIView):
    def post(self, request):
        username, password = request.POST.get('username'), request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'success': False})
        jwt = generate_new_jwt(user.pk)
        response = Response({'success': True})
        response.set_cookie(key='jwt', value=jwt)
        return response


class SignOutView(APIView):
    def post(self, request):
        response = Response({'success': True})
        response.delete_cookie(key='jwt')
        return response


class ProfileView(APIView):
    def get(self, request):
        user = get_user_by_jwt(request)
        serializer = UserAllDataSerializer(instance=user)
        return Response(transform_dict_keys_to_camel_case(serializer.data))


def is_logged_in(request):
    user = get_user_by_jwt(request)
    return JsonResponse(bool(user), safe=False)
