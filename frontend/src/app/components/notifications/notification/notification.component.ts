import { Component, Input } from '@angular/core';
import { Notification } from '../../../models/notification';
import { getBackendDatetimeAge } from "../../../utils";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  @Input() notification!: Notification;

  get notificationAge(): string {
    return getBackendDatetimeAge(this.notification.time);
  }

  getNotificationHref(): string {
    const pk: number = this.notification.objectPk;
    switch (this.notification.type) {
      case "newPost":
        return `/post/${pk}`
      case "newSubscriber":
        return `/user/${pk}`
      case "postCommented":
        return `/comment/${pk}`
      case "commentReplied":
      case "replyReplied":
        return `/reply/${pk}`
    }
  }
}
