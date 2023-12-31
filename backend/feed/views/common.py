from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from django.apps import apps
from rest_framework.views import APIView

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


class BaseRatedByAPIView(GenericAPIView):
    object_attr_name = None

    def get(self, request, model_name):
        pk = request.GET.get('pk')
        model = apps.get_model('feed', model_name)
        obj = get_object_or_404(model, pk=pk)
        liked_by = getattr(obj, self.object_attr_name).values_list('pk', flat=True)
        return Response(liked_by)


class LikedByAPIView(BaseRatedByAPIView):
    object_attr_name = 'liked_by'


class DislikedByAPIView(BaseRatedByAPIView):
    object_attr_name = 'disliked_by'
