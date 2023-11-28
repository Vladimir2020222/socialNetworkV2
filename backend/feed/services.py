from feed.enums import RateActionEnum


def rate_obj(user, obj, action):
    functions = {
        RateActionEnum.like.name: like_obj,
        RateActionEnum.dislike.name: dislike_obj,
        RateActionEnum.remove_like.name: remove_like_from_obj,
        RateActionEnum.remove_dislike.name: remove_dislike_from_obj
    }
    functions[action](user, obj)


def like_obj(user, obj):
    obj.disliked_by.remove(user)
    obj.liked_by.add(user)


def remove_like_from_obj(user, obj):
    obj.liked_by.remove(user)


def dislike_obj(user, obj):
    obj.liked_by.remove(user)
    obj.disliked_by.add(user)


def remove_dislike_from_obj(user, obj):
    obj.disliked_by.remove(user)
