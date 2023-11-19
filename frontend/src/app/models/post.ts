import { Likeable } from "./likeable";

export interface Post extends Likeable{
  pk: number,
  author: number,
  images: string[],
  text: string,
}
