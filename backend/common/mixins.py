class CachedGetObjectMixin:
    def get_object(self, *args, **kwargs):
        if hasattr(self, '_cached_object'):
            return self._cached_object
        obj = super().get_object(*args, **kwargs)
        self._cached_object = obj
        return obj
    