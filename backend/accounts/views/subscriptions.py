from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from accounts.services import subscribe, unsubscribe, is_subscribed_to
from accounts.views.mixins import GetUserMixin


class SubscribeAPIView(GetUserMixin, GenericAPIView):
    def post(self, request):
        user = self.get_object()
        if user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        subscribe_to = int(request.data.get('to'))
        subscribe(user, subscribe_to)
        return Response({'success': True})


class UnsubscribeAPIView(GetUserMixin, GenericAPIView):
    def post(self, request):
        user = self.get_object()
        if user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        unsubscribe_from = int(request.data['from'])
        unsubscribe(user, unsubscribe_from)
        return Response({'success': True})


class IsSubscribedAPIView(GetUserMixin, GenericAPIView):
    def post(self, request):
        user = self.get_object()
        if user.is_anonymous:
            return Response(False)
        to = int(request.data.get('to'))
        return Response(is_subscribed_to(user, to))
