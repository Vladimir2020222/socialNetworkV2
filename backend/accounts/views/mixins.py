from accounts.services import get_user_by_jwt


class GetUserMixin:
    def get_object(self):
        return get_user_by_jwt(self.request, raise_exception=True)
