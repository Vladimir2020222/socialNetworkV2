from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer
from accounts.services import get_user_by_jwt


class ProfileView(APIView):
    def get(self, request):
        serializer = UserSerializer(get_user_by_jwt(request))
        return Response(serializer.data)


class ChangeUserAvaAPIView(APIView):
    def patch(self, request):
        file = request.data.get('ava')
        user = get_user_by_jwt(request)
        if (not file) or (not user):
            return Response({'success': False})
        user.ava = file
        user.save()
        return Response({'success': True})


class ProfileChangeAPIView(APIView):
    def patch(self, request):
        user = get_user_by_jwt(request)
        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
