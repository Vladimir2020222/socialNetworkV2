from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    subscribers_count = serializers.SerializerMethodField(read_only=True)
    posts_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('pk', 'username', 'first_name', 'last_name', 'password', 'posts_count',
                  'last_login', 'is_superuser', 'email', 'date_joined', 'ava', 'subscribers_count')
        extra_kwargs = {
            'password': {'write_only': True}
        }
        read_only_fields = ['email']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = self.Meta.model(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def is_valid(self, *, raise_exception=False):
        is_valid = super().is_valid(raise_exception=raise_exception)
        if not is_valid:
            return False
        if 'password' in self.validated_data and self._validated_data['password'] is None:
            if raise_exception:
                raise ValidationError('password must be set')
            return False
        return True

    def get_subscribers_count(self, user):
        return user.subscribers.count()

    def get_posts_count(self, user):
        return user.post_set.count()
