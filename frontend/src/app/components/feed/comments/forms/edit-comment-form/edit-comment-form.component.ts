import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Comment } from "../../../../../models/comment"
import {FeedService} from "../../../../../services/feed.service";

@Component({
  selector: 'app-edit-comment-form',
  templateUrl: '../template.html',
  styleUrls: ['../styles.css']
})
export class EditCommentFormComponent {
  @Input() comment!: Comment;
  @Output() submitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private feedService: FeedService) {  }

  get placeholder(): string {
    return 'edit a comment';
  }

  submit(text: string): void {
    this.feedService.updateComment(this.comment.pk, text)
      .subscribe(
        (comment: Comment): void => {
          this.comment.text = comment.text;
          this.comment.updDate = comment.updDate;
          this.submitted.emit(true);
        }
      );
  }
}
