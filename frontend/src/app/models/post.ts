export enum PostRateEnum {
  none,
  like,
  dislike
}


export interface Post {
  pk: number,
  likes: number,
  dislikes: number,
  author: number,
  images: string[],
  text: string,
  current_user_rate: PostRateEnum;
}
