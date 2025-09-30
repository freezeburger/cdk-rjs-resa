
import * as Generics from '../types/generic.types'

export interface ServerPost extends Generics.WithUniqueId {
  title: Generics.ShortText
  body: Generics.LongText
  tags: Generics.ShortText[]
  reactions: Reactions
  views: number
  userId: number
}

export interface Reactions {
  likes: number
  dislikes: number
}


export type Post = Pick<ServerPost, 'id' | 'title' | 'body'> ;