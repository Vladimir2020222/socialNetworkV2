import { Likeable } from "./likeable";
import { PkMixin } from "./pk-mixin";
import { AuthorMixin } from "./author-mixin";
import { PubUpdDateMixin } from "./pub-upd-date-mixin";

export interface CommentBase extends Likeable, PkMixin, AuthorMixin, PubUpdDateMixin {
  pk: number,
  text: string,
}
