from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'password')

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
        if self._validated_data['password'] is None:
            if raise_exception:
                raise ValidationError('password must be set')
            return False
        return True


class UserAllDataSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ('pk', 'username', 'first_name', 'last_name', 'password',
                  'last_login', 'is_superuser', 'email', 'date_joined', 'ava')

    def create(self, validated_data):
        raise NotImplementedError(f'To create User use UserSerializer, not {self.__class__.__name__}')
