import type Redis from "ioredis";
import type { UserModel } from "../../database";

export class SynchronizeFavoritesCacheController {
  private userModel: UserModel
  private redis: Redis
  constructor(redis: Redis,userModel:UserModel){
    this.userModel = userModel
    this.redis = redis
  }
  public async handle():Promise<void>{
    const allFavoritesKeys = await this.redis.keys("favorites*")
    allFavoritesKeys.forEach(async (key) => {
      const userFavoriteProductsCache = await this.redis.get(key)
      const userFavoriteProducts = JSON.parse(userFavoriteProductsCache as string)
      const userEmail = key.slice(14)
      this.userModel.setFavorites(userEmail,userFavoriteProducts)
      this.redis.del(key)
    })
  }
}
