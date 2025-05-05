import type { ObjectId } from "mongodb"
import type { FavoriteDto } from "./FavoritesDto"
import type { PurchaseDto } from "./PurchaseDto"

export type UserDto = {
  _id?: ObjectId
  name: string 
  email: string 
  password: string
  address: {
    city: string
    street: string
    zipCode: string
    number: string
  }
  favorites: FavoriteDto[]
  purchases: PurchaseDto[]
}
