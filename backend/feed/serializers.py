from rest_framework import serializers

from feed.enums import PostRateEnum
from feed.models import Post


class PostSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField(read_only=True)
    dislikes = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    current_user_rate = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ['pk', 'likes', 'dislikes', 'images', 'author', 'text', 'current_user_rate']
        read_only_fields = ['liked_by', 'disliked_by']
        extra_kwargs = {
            'author': {
                'default': serializers.CurrentUserDefault()
            }
        }

    def get_images(self, obj):
        images = obj.images.only('content')
        return [image.content.url for image in images]

    def get_dislikes(self, obj):
        return obj.disliked_by.count()

    def get_likes(self, obj):
        return obj.liked_by.count()

    def get_current_user_rate(self, obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return PostRateEnum.none.value
        if obj.liked_by.contains(user):
            return PostRateEnum.like.value
        if obj.disliked_by.contains(user):
            return PostRateEnum.dislike.value
        return PostRateEnum.none.value
