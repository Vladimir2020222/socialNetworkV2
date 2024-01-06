import { LikeableRateEnum } from "../enums/likeable-rate";
import { PkMixin } from "./pk-mixin";

export interface Likeable extends PkMixin {
  dislikes: number,
  likes: number,
  currentUserRate: LikeableRateEnum
}
