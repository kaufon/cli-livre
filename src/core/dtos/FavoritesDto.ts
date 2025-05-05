import { ObjectId } from "mongodb"

export type FavoriteDto = {
  productId?: ObjectId
  productName: string 
  productDescription: string
  productPrice: number
}
