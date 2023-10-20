export interface User {
  id: number,
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
