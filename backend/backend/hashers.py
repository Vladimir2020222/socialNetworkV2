from django.contrib.auth.hashers import PBKDF2PasswordHasher


class WeakPBKDF2PasswordHasher(PBKDF2PasswordHasher):
    iterations = 1
    salt_entropy = 1
