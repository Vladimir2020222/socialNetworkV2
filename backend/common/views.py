from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class SetTimezoneAPIView(APIView):
    def post(self, request):
        timezone = request.data.get('timezone')
        if not timezone:
            return Response('timezone not supplied', status=status.HTTP_400_BAD_REQUEST)
        if timezone.count('/') != 1:
            return Response('wrong timezone format', status=status.HTTP_400_BAD_REQUEST)
        if (user := request.user).is_authenticated:
            user.timezone_name = timezone
            user.save()
        request.session[settings.TIMEZONE_SESSION_KEY] = timezone
        return Response('')
