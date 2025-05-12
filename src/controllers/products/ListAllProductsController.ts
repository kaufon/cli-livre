import type {  ProductModel } from "../../database/ProductModel";

export class ListAllProductsController {
  private productModel: ProductModel;
  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }
  async handle() {
    const products = await this.productModel.listAll();
    const filteredSellers = products.map((product) => ({
      ID: product.id,
      Preco: product.price,
      Nome: product.name,
    }));
    console.table(filteredSellers);
    return;
  }
}
