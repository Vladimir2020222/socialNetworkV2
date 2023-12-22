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


class LikedByAPIView(GenericAPIView):
    def get(self, request, model_name):
        pk = request.GET.get('pk')
        model = apps.get_model('feed', model_name)
        obj = model.objects.get(pk=pk)
        liked_by = obj.liked_by.values_list('pk', flat=True)
        return Response(liked_by)


class DislikedByAPIView(GenericAPIView):
    def get(self, request, model_name):
        pk = request.GET.get('pk')
        model = apps.get_model('feed', model_name)
        obj = model.objects.get(pk=pk)
        disliked_by = obj.dsiliked_by.values_list('pk', flat=True)
        return Response(disliked_by)
