import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { SellerModel } from "../../database/SellerModel";
import { SelectSellerController } from "../sellers/SelectSellerController";
import { SelectSellerProductController } from "./SelectSellerProductController";
export class UpdateProductController {
  private input: IInput;
  private productModel: ProductModel;
  private sellerModel: SellerModel;
  constructor(
    input: IInput,
    productModel: ProductModel,
    sellerModel: SellerModel,
  ) {
    this.input = input;
    this.productModel = productModel;
    this.sellerModel = sellerModel;
  }
  public async handle() {
    const seller = await new SelectSellerController(
      this.sellerModel,
      this.input,
    ).handle();
    if (!seller) {
      return;
    }

    const product = await new SelectSellerProductController(
      this.productModel,
      this.input,
    ).handle(seller.products);
    if (!product) {
      return;
    }

    const productId = product.productId;
    const updates: Partial<{
      name: string;
      description: string;
      price: number;
    }> = {};

    let isRunning = true;
    while (isRunning) {
      const choice = await this.input.selectInput("O que deseja atualizar?", [
        ["Nome", "name"],
        ["Descrição", "description"],
        ["Preço", "price"],
        ["Voltar", "exit"],
      ]);

      switch (choice) {
        case "name": {
          const name = await this.input.textInput("Novo nome:");
          await this.productModel.updateProductById(productId, { name });
          updates.name = name;
          console.log("Nome atualizado com sucesso!");
          break;
        }
        case "description": {
          const description = await this.input.textInput("Nova descrição:");
          await this.productModel.updateProductById(productId, { description });
          updates.description = description;
          console.log("Descrição atualizada com sucesso!");
          break;
        }
        case "price": {
          const price = await this.input.numberInput("Novo preço:");
          await this.productModel.updateProductById(productId, { price });
          updates.price = price;
          console.log("Preço atualizado com sucesso!");
          break;
        }
        case "exit": {
          isRunning = false;
          break;
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      await this.sellerModel.updateSellerProduct(
        seller._id,
        productId,
        updates,
      );
      console.log("Produto atualizado também no vendedor.");
    }
  }
}
