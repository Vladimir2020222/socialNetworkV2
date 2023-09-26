from django.urls import path
from .views import SignUpView, SignOutView, SignInView, ChangeUserAvaView, ProfileView, IsLoggedInView, \
    IsSubscribedView, SubscribeView, UnsubscribeView, PasswordChangeView, PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path('logout', SignOutView.as_view(), name='logout'),
    path('login', SignInView.as_view(), name='login'),
    path('signup', SignUpView.as_view(), name='signup'),
    path('profile', ProfileView.as_view(), name='profile'),
    path('change_ava', ChangeUserAvaView.as_view(), name='change_ava'),
    path('is_authenticated', IsLoggedInView.as_view(), name='is_authenticated'),

    path('subscribe', SubscribeView.as_view(), name='subscribe'),
    path('unsubscribe', UnsubscribeView.as_view(), name='unsubscribe'),
    path('is_subscribed', IsSubscribedView.as_view(), name='is_subscribed'),

    path('change_email', PasswordChangeView.as_view(), name='password_change_view'),
    path('password_reset', PasswordResetView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>', PasswordResetConfirmView.as_view(), name='password_reset_confirm')
]
