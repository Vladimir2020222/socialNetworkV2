import { CommentBase } from "./comment-base";

export interface Comment extends CommentBase {
  post: number,
  replies: number[]
}
