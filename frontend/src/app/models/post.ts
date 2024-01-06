import { Likeable } from "./likeable";
import { AuthorMixin } from "./author-mixin";
import { PubUpdDateMixin } from "./pub-upd-date-mixin";

export interface Post extends Likeable, AuthorMixin, PubUpdDateMixin {
  pk: number,
  images: string[],
  text: string,
}
