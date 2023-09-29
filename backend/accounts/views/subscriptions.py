from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.services import get_user_by_jwt, subscribe, unsubscribe, is_subscribed_to
from accounts.views.mixins import GetUserMixin


class SubscribeAPIView(GetUserMixin, GenericAPIView):
    def post(self, request):
        user = self.get_object()
        subscribe_to = int(request.data.get('to'))
        subscribe(user, subscribe_to)
        return Response({'success': True})


class UnsubscribeAPIView(GetUserMixin, GenericAPIView):
    def post(self, request):
        user = self.get_object()
        unsubscribe_from = int(request.data['from'])
        unsubscribe(user, unsubscribe_from)
        return Response({'success': True})


class IsSubscribedAPIView(GetUserMixin, GenericAPIView):
    def post(self, request):
        user = self.get_object()
        to = int(request.data.get('from'))
        return Response(is_subscribed_to(user, to))
