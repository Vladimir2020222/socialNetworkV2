from rest_framework import serializers

from feed.enums import RateEnum
from feed.models import Post, Comment, Reply


class BaseLikeablePubUpdDateSerializer(serializers.Serializer):
    dislikes = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    current_user_rate = serializers.SerializerMethodField()
    pub_date = serializers.SerializerMethodField()
    upd_date = serializers.SerializerMethodField()

    class Meta:
        fields = ['likes', 'dislikes', 'current_user_rate', 'pub_date', 'upd_date']

    def get_pub_date(self, obj):
        return obj.pub_date.strftime("%Y-%m-%d %H:%M:%S%z")

    def get_upd_date(self, obj):
        return obj.pub_date.strftime("%Y-%m-%d %H:%M:%S%z")

    def get_dislikes(self, obj):
        return obj.disliked_by.count()

    def get_likes(self, obj):
        return obj.liked_by.count()

    def get_current_user_rate(self, obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return RateEnum.none.value
        if obj.liked_by.contains(user):
            return RateEnum.like.value
        if obj.disliked_by.contains(user):
            return RateEnum.dislike.value
        return RateEnum.none.value


class PostSerializer(serializers.ModelSerializer, BaseLikeablePubUpdDateSerializer):
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = BaseLikeablePubUpdDateSerializer.Meta.fields + ['pk', 'images', 'author', 'text']
        extra_kwargs = {
            'author': {
                'default': serializers.CurrentUserDefault()
            }
        }

    def get_images(self, obj):
        images = obj.images.all()
        return [{'pk': image.pk, 'url': image.content.url} for image in images]


class CommentSerializer(serializers.ModelSerializer, BaseLikeablePubUpdDateSerializer):
    class Meta:
        model = Comment
        fields = BaseLikeablePubUpdDateSerializer.Meta.fields + ['pk', 'author', 'text', 'post']
        extra_kwargs = {
            'author': {
                'default': serializers.CurrentUserDefault()
            }
        }


class ReplySerializer(serializers.ModelSerializer, BaseLikeablePubUpdDateSerializer):
    class Meta:
        model = Reply
        fields = BaseLikeablePubUpdDateSerializer.Meta.fields + ['pk', 'author', 'text', 'to', 'reply_to']
        extra_kwargs = {
            'author': {
                'default': serializers.CurrentUserDefault()
            },
            'reply_to': {
                'allow_empty': True
            }
        }
