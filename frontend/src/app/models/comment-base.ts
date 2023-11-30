import { Likeable } from "./likeable";
import { PkMixin } from "./pk-mixin";
import { AuthorMixin } from "./author-mixin";

export interface CommentBase extends Likeable, PkMixin, AuthorMixin {
  pk: number,
  text: string,
}
