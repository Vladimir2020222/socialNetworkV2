from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.services import get_user_by_jwt, subscribe, unsubscribe, is_subscribed_to


class SubscribeAPIView(APIView):
    def post(self, request):
        user = get_user_by_jwt(request)
        subscribe_to = int(request.data.get('to'))
        subscribe(user, subscribe_to)
        return Response({'success': True})


class UnsubscribeAPIView(APIView):
    def post(self, request):
        user = get_user_by_jwt(request)
        unsubscribe_from = int(request.data['from'])
        unsubscribe(user, unsubscribe_from)
        return Response({'success': True})


class IsSubscribedAPIView(APIView):
    def post(self, request):
        user = get_user_by_jwt(request)
        to = int(request.data.get('from'))
        return Response(is_subscribed_to(user, to))
