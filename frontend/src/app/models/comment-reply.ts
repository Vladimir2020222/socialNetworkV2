import { CommentBase } from "./comment-base";

export interface CommentReply extends CommentBase {
  to: number,
  reply_to: number[]
}
