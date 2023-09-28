from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin, RetrieveModelMixin

from accounts.serializers import UserSerializer
from accounts.views.mixins import GetUserMixin


class ProfileAPIView(GetUserMixin, RetrieveModelMixin, UpdateModelMixin, GenericAPIView):
    serializer_class = UserSerializer

    def get(self, request):
        return self.retrieve(request)

    def patch(self, request):
        return self.update(request, partial=True)
