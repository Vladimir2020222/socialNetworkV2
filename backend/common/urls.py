from django.urls import path
from .views import SetTimezoneAPIView


urlpatterns = [
    path('set_timezone', SetTimezoneAPIView.as_view(), name='set_timezone')
]
