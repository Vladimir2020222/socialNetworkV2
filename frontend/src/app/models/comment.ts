import { CommentBase } from "./comment-base";

export interface Comment extends CommentBase {
  post_pk: number,
  replies: number[]
}
