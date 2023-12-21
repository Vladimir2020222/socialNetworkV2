from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from django.apps import apps
from feed.services import rate_obj


class RateAPIView(GenericAPIView):
    def post(self, request, model_name, pk, action):
        user = request.user
        if user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        model = apps.get_model('feed', model_name)
        obj = model.objects.get(pk=pk)
        rate_obj(user, obj, action)
        return Response()
