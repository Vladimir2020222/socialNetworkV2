import { CommentBase } from "./comment-base";

export interface CommentReply extends CommentBase {
  to: number,
  replyTo: number[]
}
