from django.urls import path
from .views import SignUpView, SignOutView, SignInView, ChangeUserAva, ProfileView, is_logged_in


urlpatterns = [
    path('logout', SignOutView.as_view(), name='logout'),
    path('login', SignInView.as_view(), name='login'),
    path('signup', SignUpView.as_view(), name='signup'),
    path('profile', ProfileView.as_view(), name='profile'),
    path('change_ava', ChangeUserAva.as_view(), name='change_ava'),
    path('is_authenticated', is_logged_in, name='is_authenticated')
]
