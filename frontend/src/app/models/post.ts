export interface Post {
  pk: number,
  liked_by: number[],
  disliked_by: number[],
  author: number,
  images: string[],
}
