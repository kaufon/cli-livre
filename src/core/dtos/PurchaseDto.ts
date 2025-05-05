import type { ObjectId } from "mongodb"

export type PurchaseDto = {
  _id?: ObjectId
  productId: ObjectId
  productName: string
  productPrice?: number
  quantity: number
  totalPrice: number
}
