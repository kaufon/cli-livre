import { SellerModel } from "../../database/SellerModel";

export class ListAllSellersController{
  private sellerModel: SellerModel
  constructor(sellerModel: SellerModel){
    this.sellerModel = sellerModel
  }
  async handle(){
    const sellers = await this.sellerModel.listAllSellers()
    const filteredSellers = sellers.map((seller) => ({
      Nome: seller.name,
      Email: seller.email,
    }))
    console.table(filteredSellers)
    return
  }
}
