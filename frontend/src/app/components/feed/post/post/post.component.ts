import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from "../../../../models/post";
import { Comment } from "../../../../models/comment";
import { serverUrl } from "../../../../constants";
import {ActivatedRoute, Params} from "@angular/router";
import { FeedService } from "../../../../services/feed.service";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post | null = null;
  newComments: Comment[] = [];
  showComments: boolean = false;
  openReplyPk: number | null = null;
  openCommentPk: number | null = null;
  @Output() outPostIdViewed: EventEmitter<number> = new EventEmitter<number>;

  constructor(private feedService: FeedService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.post !== null) return;
    let postPk: number = Number(this.route.snapshot.paramMap.get('postPk'));
    if (isNaN(postPk)) return;
    this.feedService.getPostByPk(postPk)
      .subscribe((post: Post): void => {
        this.post = post;
      });
    this.openCommentOrReply();
  }

  openCommentOrReply(): void {
    this.route.queryParams.subscribe(
      (params: Params): void => {
        const commentPk: number = Number(params['commentPk']);
        if (!isNaN(commentPk)) {
          this.openCommentPk = commentPk;
          this.showComments = true;
          return;
        }
        const replyPk: number = Number(params['replyPk']);
        if (!isNaN(replyPk)) {
          this.openReplyPk = replyPk;
          this.showComments = true;
        }
      }
    )
  }

  getSrcForAddingPostToViewed(): string {
    return serverUrl + `feed/add_post_to_viewed/${this.post?.pk}`
  }

  postViewed(): void {
    if (!this.post) return;
    this.outPostIdViewed.emit(this.post.pk);
  }
}
