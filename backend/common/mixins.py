class CachedGetObjectMixin:
    def get_object(self):
        if hasattr(self, '_cached_object'):
            return self._cached_object
        obj = super().get_object()
        self._cached_object = obj
        return obj
