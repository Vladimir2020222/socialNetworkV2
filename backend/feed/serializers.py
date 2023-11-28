from rest_framework import serializers

from feed.enums import RateEnum
from feed.models import Post, Comment, Reply


class BaseLikeableSerializer(serializers.Serializer):
    dislikes = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    current_user_rate = serializers.SerializerMethodField()

    class Meta:
        fields = ['likes', 'dislikes', 'current_user_rate']

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


class PostSerializer(serializers.ModelSerializer, BaseLikeableSerializer):
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = BaseLikeableSerializer.Meta.fields + ['pk', 'images', 'author', 'text']
        extra_kwargs = {
            'author': {
                'default': serializers.CurrentUserDefault()
            }
        }

    def get_images(self, obj):
        images = obj.images.only('content')
        return [image.content.url for image in images]


class CommentSerializer(serializers.ModelSerializer, BaseLikeableSerializer):
    class Meta:
        model = Comment
        fields = BaseLikeableSerializer.Meta.fields + ['pk', 'author', 'text', 'post']
        extra_kwargs = {
            'author': {
                'default': serializers.CurrentUserDefault()
            }
        }


class ReplySerializer(serializers.ModelSerializer, BaseLikeableSerializer):
    class Meta:
        model = Reply
        fields = BaseLikeableSerializer.Meta.fields + ['pk', 'author', 'text', 'to', 'reply_to']
        extra_kwargs = {
            'author': {
                'default': serializers.CurrentUserDefault()
            }
        }
