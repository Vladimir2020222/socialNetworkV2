import { Likeable } from "./likeable";
import { PkMixin } from "./pk-mixin";

export interface CommentBase extends Likeable, PkMixin {
  pk: number,
  text: string,
}
