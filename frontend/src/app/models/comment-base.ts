import { Likeable } from "./likeable";

export interface CommentBase extends Likeable {
  pk: number,
  text: string,
}
