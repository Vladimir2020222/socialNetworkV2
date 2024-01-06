import { PkMixin } from "./pk-mixin";

export interface User extends PkMixin {
  username: string,
  firstName: string | null,
  lastName: string | null,
  postsCount: number,
  lastLogin: string | null,
  isSuperuser: boolean,
  email: string | null,
  dateJoined: string,
  ava: string,
  subscribersCount: number
}
