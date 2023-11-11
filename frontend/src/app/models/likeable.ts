import { LikeableRateEnum } from "../enums/likeable-rate";

export interface Likeable {
  dislikes: number,
  likes: number,
  current_user_rate: LikeableRateEnum
}
