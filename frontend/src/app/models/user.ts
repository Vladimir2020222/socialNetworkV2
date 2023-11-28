import { PkMixin } from "./pk-mixin";

export interface User extends PkMixin {
  username: string,
  first_name: string | null,
  last_name: string | null,
  posts_count: number,
  last_login: string | null,
  is_superuser: boolean,
  email: string | null,
  date_joined: string,
  ava: string,
  subscribers_count: number
}
