import type { ObjectId } from "mongodb";
import type { ProductDocument, ProductModel } from "../../database/ProductModel";

export class ListProductsController {
  private productModel: ProductModel;
  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }
  async handle(
    products: Array<{
      productId: ObjectId;
      name: string;
      description: string;
      price: number;
    }>,
  ) {
    const filteredSellers = products.map((product) => ({
      ID: product.productId,
      Preco: product.price,
      Nome: product.name,
      Descricao: product.description,
    }));
    console.table(filteredSellers);
    return;
  }
}
