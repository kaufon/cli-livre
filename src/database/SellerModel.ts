import { driver } from "./DatabaseConfiguration"; 
import { randomUUID } from "node:crypto";

type Address = {
  city: string;
  street: string;
  zipCode: string;
  number: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type Sell = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export class SellerModel {
  public session = driver.session()
  async addSeller(
    name: string,
    email: string,
    password: string,
    address: Address
  ) {
    const id = randomUUID();
    await this.session.run(
      `
      CREATE (s:Seller {
        id: $id, name: $name, email: $email, password: $password,
        city: $city, street: $street, zipCode: $zipCode, number: $number
      })
      `,
      { id, name, email, password, ...address }
    );
    return { id, name, email };
  }

  async listAllSellers() {
    const result = await this.session.run(`MATCH (s:Seller) RETURN s`);
    return result.records.map((r) => r.get("s").properties);
  }

  async addProduct(product: Product, sellerId: string) {
    await this.session.run(
      `
      MATCH (s:Seller { id: $sellerId })
      MERGE (p:Produto {
        id: $id, name: $name, description: $description, price: $price
      })
      MERGE (s)-[:VENDE]->(p)
      `,
      { sellerId, ...product }
    );
  }

  async addSell(sellerId: string, sell: Sell) {
    await this.session.run(
      `
      MATCH (s:Seller { id: $sellerId })
      MATCH (p:Produto { id: $productId })
      MERGE (s)-[r:VENDEU]->(p)
      SET r.quantity = $quantity, r.price = $price
      `,
      { sellerId, ...sell }
    );
  }

  async findSellerIdByProductId(productId: string): Promise<string | null> {
    const result = await this.session.run(
      `
      MATCH (s:Seller)-[:VENDE]->(p:Produto { id: $productId })
      RETURN s.id AS sellerId
      `,
      { productId }
    );
    const record = result.records[0];
    return record ? record.get("sellerId") : null;
  }
}
