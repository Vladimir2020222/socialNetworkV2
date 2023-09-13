from rest_framework import serializers

from feed.models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['liked_by', 'disliked_by']


class PostEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['liked_by', 'disliked_by']
        extra_kwargs = {
            'author': {'required': False}
        }
