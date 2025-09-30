
import * as Generics from '../types/generic.types'

export interface Product extends Generics.WithUniqueId {
  title: Generics.ShortText
  description: Generics.LongText
  category: Generics.Category
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: Generics.ShortText[]
  brand: Generics.ShortText
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: Generics.ShortText
  shippingInformation: Generics.ShortText
  availabilityStatus: Generics.ShortText
  reviews: Review[]
  returnPolicy: Generics.LongText
  minimumOrderQuantity: number
  meta: Meta
  images: Generics.ImageUrl[]
  thumbnail: Generics.ImageUrl
}
 
export interface Dimensions {
  width: number
  height: number
  depth: number
}
 
export interface Review {
  rating: number
  comment: Generics.LongText
  date: string
  reviewerName: Generics.ShortText
  reviewerEmail: Generics.ShortText
}
 
export interface Meta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}
 