import type { SellerModel } from "../../database/SellerModel";

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
      Cidade: seller.city,
      Rua: seller.street,
      CEP: seller.zipcode,
    }))
    console.table(filteredSellers)
    return
  }
}
