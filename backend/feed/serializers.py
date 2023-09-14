from rest_framework import serializers

from feed.models import Post


class PostSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['liked_by', 'disliked_by']

    def get_images(self, obj):
        images = obj.images.values('content')
        return list(images)
