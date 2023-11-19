from django.db.models import ForeignKey
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from feed.serializers import PostSerializer, CommentSerializer, ReplySerializer


class BaseScrollableAPIView(GenericAPIView):
    offset_get_param_name = 'offset'
    amount_get_param_name = 'amount'
    fk_field_name = None
    pk_url_kwarg = 'pk'

    def get(self, request, pk):
        self._validate_attributes()
        offset = int(request.GET.get(self.offset_get_param_name))
        amount = int(request.GET.get(self.amount_get_param_name))
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


class PostsByUserScrollableAPIView(BaseScrollableAPIView):
    serializer_class = PostSerializer


class PostCommentsScrollableAPIView(BaseScrollableAPIView):
    serializer_class = CommentSerializer
    fk_field_name = 'post'


class CommentRepliesScrollableAPIView(BaseScrollableAPIView):
    serializer_class = ReplySerializer
    fk_field_name = 'to'
