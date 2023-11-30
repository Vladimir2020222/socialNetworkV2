import { Likeable } from "./likeable";
import { AuthorMixin } from "./author-mixin";

export interface Post extends Likeable, AuthorMixin {
  pk: number,
  images: string[],
  text: string,
}
