from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from django.apps import apps
from feed.services import rate_obj


class RateAPIView(GenericAPIView):
    def post(self, request, model_name, pk, action):
        model = apps.get_model(self.request.resolver_match.app_name, model_name)
        obj = model.objects.get(pk=pk)
        rate_obj(request.user, obj, action)
        return Response
