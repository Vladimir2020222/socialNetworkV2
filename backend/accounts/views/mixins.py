class GetUserMixin:
    def get_object(self):
        return self.request.user
