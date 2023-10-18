def like_post(user, post):
    post.disliked_by.remove(user)
    post.liked_by.add(user)


def remove_like_from_post(user, post):
    post.liked_by.remove(user)


def dislike_post(user, post):
    post.liked_by.remove(user)
    post.disliked_by.add(user)


def remove_dislike_from_post(user, post):
    post.disliked_by.remove(user)
