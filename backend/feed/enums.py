from enum import Enum


class RateEnum(Enum):
    none = 0
    like = 1
    dislike = 2


class RateActionEnum(Enum):
    like = 0
    dislike = 1
    remove_like = 2
    remove_dislike = 3
