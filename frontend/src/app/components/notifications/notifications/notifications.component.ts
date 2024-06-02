import {Component, OnInit} from '@angular/core';
import { FeedService } from "../../../services/feed.service";
import { Notification } from "../../../models/notification";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  offset: number = 0;  // notifications.length is not used here because if two requests are sent simultaneously
                       // copies of notifications may be returned
  amount: number = 5;


  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadMoreNotifications();
  }

  loadMoreNotifications(): void {
    this.offset += this.amount;
    this.feedService.getNotifications(this.offset - this.amount, this.amount)
      .subscribe((notifications: Notification[]): void => {
        this.notifications.push(...notifications);
      });
  }
}
