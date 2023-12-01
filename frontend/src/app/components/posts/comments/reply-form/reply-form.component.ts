import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from "../../../../models/comment";
import { PostService } from "../../../../services/post.service";
import { Post } from "../../../../models/post";
import { CommentReply } from "../../../../models/comment-reply";
import { AccountService } from "../../../../services/account.service";
import { Observable } from "rxjs";
import { User } from "../../../../models/user";
import { usersCache } from "../../../../cache/users-cache";
import { getUserFromCache } from "../../../../utils";

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.css']
})
export class ReplyFormComponent {
  @Input() object!: Post | Comment;
  @Input() objectName!: 'post' | 'comment';
  @Output() newObject: EventEmitter<Comment | CommentReply> = new EventEmitter<Comment | CommentReply>();

  constructor(private accountService: AccountService, private postService: PostService) {}

  getPlaceholderForInput(): string {
    if (this.objectName === 'post')
      return 'leave comment';
    const author: User | undefined = getUserFromCache(this.object.author);
    if (!author)
      return '';
    return `reply to ${author.first_name} ${author.last_name}`
  }

  submitCallback(obj: Comment | CommentReply): void {
    this.newObject.emit(obj);
  }

  submit(text: string): void {
    if (this.objectName === 'post')
      this.postService.createComment(this.object.pk, text).subscribe(this.submitCallback);
    else
      this.postService.createReply(this.object.pk, text).subscribe(this.submitCallback);
  }
}
