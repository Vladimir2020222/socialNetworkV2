from django.urls import path
from .views import SignUpAPIView, SignOutAPIView, SignInAPIView, ChangeUserAvaAPIView, ProfileView, IsLoggedInAPIView, \
    IsSubscribedAPIView, SubscribeAPIView, UnsubscribeAPIView, PasswordChangeAPIView, PasswordResetAPIView, PasswordResetConfirmAPIView

urlpatterns = [
    path('logout', SignOutAPIView.as_view(), name='logout'),
    path('login', SignInAPIView.as_view(), name='login'),
    path('signup', SignUpAPIView.as_view(), name='signup'),
    path('profile', ProfileView.as_view(), name='profile'),
    path('change_ava', ChangeUserAvaAPIView.as_view(), name='change_ava'),
    path('is_authenticated', IsLoggedInAPIView.as_view(), name='is_authenticated'),

    path('subscribe', SubscribeAPIView.as_view(), name='subscribe'),
    path('unsubscribe', UnsubscribeAPIView.as_view(), name='unsubscribe'),
    path('is_subscribed', IsSubscribedAPIView.as_view(), name='is_subscribed'),

    path('change_email', PasswordChangeAPIView.as_view(), name='password_change_view'),
    path('password_reset', PasswordResetAPIView.as_view(), name='password_reset'),
    path('password_reset_confirm', PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm')
]
