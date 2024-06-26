from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.response import Response

from accounts.utils import api_login_required
from common.mixins import CachedGetObjectMixin


class BaseAuthorOwnedModelAPIView(
    CachedGetObjectMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericAPIView
):
    def send_object_created_notification(self, instance):
        pass

    def user_allowed_to_change_object(self):
        return self.get_object().author == self.request.user or self.request.user.has_perm('feed.del_post')

    def perform_create(self, serializer):
        super().perform_create(serializer)
        self.send_object_created_notification(serializer.instance)

    def get(self, request, pk):
        return self.retrieve(request)

    @method_decorator(api_login_required)
    def post(self, request):
        return self.create(request)

    @method_decorator(api_login_required)
    def delete(self, request, pk):
        if self.user_allowed_to_change_object():
            return self.destroy(request)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @method_decorator(api_login_required)
    def patch(self, request, pk):
        if self.user_allowed_to_change_object():
            return self.partial_update(request)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        if lookup_url_kwarg in self.kwargs:
            return super().get_object()
