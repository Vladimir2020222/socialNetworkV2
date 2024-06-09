import { PkMixin } from "./pk-mixin";
import { NotificationType } from '../types/notification-type';
import { backendDatetimeType } from "../types/backend-datetime";

export interface Notification extends PkMixin {
  text: string;
  type: NotificationType;
  objectPk: number;
  time: backendDatetimeType;
  meta: { [key: string]: string };
}
