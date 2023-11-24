import { Component, Input, OnInit } from '@angular/core';
import { Comment} from "../../../../models/comment";
import { PostService } from "../../../../services/post.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  showReplies: boolean = false;
  repliesAmount: number = 0;
  repliesAmountToShow: number = 2;
  repliesIncrement = 2;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.setRepliesAmount();
  }

  setRepliesAmount(): void {
    this.postService.getRepliesAmount(this.comment.pk)
      .subscribe((repliesAmount: number): void => {
        this.repliesAmount = repliesAmount;
      })
  }

  showMoreReplies(): void {
    if (this.repliesAmountToShow + this.repliesIncrement >= this.repliesAmount)
      this.repliesAmountToShow = this.repliesAmount;
    else
      this.repliesAmountToShow += this.repliesIncrement;
  }

  toggleReplies(): void {
    // if (this.repliesAmountToShow === 0) {
    //
    // }
    this.showReplies = !this.showReplies;
  }
}
