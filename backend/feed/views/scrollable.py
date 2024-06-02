from django.db.models import ForeignKey
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from common.decorators import conditional_cache_page
from feed.models import Notification
from feed.serializers import PostSerializer, CommentSerializer, ReplySerializer, NotificationSerializer


class BaseScrollableAPIView(GenericAPIView):
    offset_get_param_name = 'offset'
    amount_get_param_name = 'amount'
    fk_field_name = None
    pk_url_kwarg = 'pk'
    max_amount = 40

    def __init__(self, **kwargs):
        assert 'offset_get_param_name' not in kwargs, 'offset_get_param_name cannot be passed to as_view()'
        assert 'amount_get_param_name' not in kwargs, 'amount_get_param_name cannot be passed to as_view()'
        super().__init__(**kwargs)

    def get(self, request, pk):
        self._validate_attributes()
        offset, amount = self.get_offset_and_amount(request)
        if (offset, amount) == (None, None):
            return Response(status=status.HTTP_403_FORBIDDEN)
        queryset = self.get_queryset()[offset:amount+offset]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def _validate_attributes(self):
        assert self.serializer_class, 'serializer class must be set'

    def get_queryset(self):
        field = self.get_fk_field_name() + '_id'
        value = self.kwargs.get(self.pk_url_kwarg)
        return self.model.objects.filter(**{field: value})

    def get_fk_field_name(self):
        if self.fk_field_name:
            return self.fk_field_name
        fields = self.model._meta.fields
        fks = [field for field in fields if isinstance(field, ForeignKey)]
        if len(fks) == 0:
            raise ValueError('Model %s has no ForeignKeys' % (self.model.__name__,))
        elif len(fks) == 1:
            return fks[0].name
        raise ValueError('Model %s has multiple ForeignKeys, but fk_field_name is not specified')

    @property
    def model(self):
        return self.serializer_class.Meta.model

    @classmethod
    def get_offset_and_amount(cls, request):
        offset = int(request.GET.get(cls.offset_get_param_name))
        amount = int(request.GET.get(cls.amount_get_param_name))
        if amount > cls.max_amount:
            return None, None
        return offset, amount

    @classmethod
    def should_cache(cls, request, response):
        offset, amount = cls.get_offset_and_amount(request)
        try:
            return len(response.data) == amount
        except TypeError:
            return False


class PostsByUserAPIView(BaseScrollableAPIView):
    serializer_class = PostSerializer


conditional_cache_decorator = method_decorator(
    conditional_cache_page(
        60,
        lambda _, request, response, *args, **kwargs: BaseScrollableAPIView.should_cache(request, response)
    ),
    name='dispatch'
)


@conditional_cache_decorator
class PostCommentsAPIView(BaseScrollableAPIView):
    serializer_class = CommentSerializer
    fk_field_name = 'post'


@conditional_cache_decorator
class CommentRepliesAPIView(BaseScrollableAPIView):
    serializer_class = ReplySerializer
    fk_field_name = 'to'


class NotificationsAPIView(BaseScrollableAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(users=self.request.user).order_by('-time')
