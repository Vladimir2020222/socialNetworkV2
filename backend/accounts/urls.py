from django.urls import path
from .views import SignUpView, SignOutView, SignInView, ChangeUserAva, ProfileView, IsLoggedIn, \
    IsSubscribedView, SubscribeView, UnsubscribeView


urlpatterns = [
    path('logout', SignOutView.as_view(), name='logout'),
    path('login', SignInView.as_view(), name='login'),
    path('signup', SignUpView.as_view(), name='signup'),
    path('profile', ProfileView.as_view(), name='profile'),
    path('change_ava', ChangeUserAva.as_view(), name='change_ava'),
    path('is_authenticated', IsLoggedIn.as_view(), name='is_authenticated'),

    path('subscribe', SubscribeView.as_view(), name='subscribe'),
    path('unsubscribe', UnsubscribeView.as_view(), name='unsubscribe'),
    path('is_subscribed', IsSubscribedView.as_view(), name='is_subscribed')
]
