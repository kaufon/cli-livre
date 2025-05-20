import { driver} from './DatabaseConfiguration'; 
import { randomUUID } from 'node:crypto';

type Address = {
  city: string;
  street: string;
  zipCode: string;
  number: string;
};

type FavoriteProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type Purchase = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

export class UserModel {
  public session = driver.session()
  async addUser(
    name: string,
    email: string,
    password: string,
    address: Address
  ) {
    const id = randomUUID();
    await this.session.run(
      `
      CREATE (u:User {
        id: $id, name: $name, email: $email, password: $password,
        city: $city, street: $street, zipCode: $zipCode, number: $number
      })
      `,
      { id, name, email, password, ...address }
    );
    return { id, name, email };
  }

  async listAllUsers() {
    const result = await this.session.run(`MATCH (u:User) RETURN u`);
    return result.records.map(r => r.get('u').properties);
  }

  async addFavorite(userId: string, product: FavoriteProduct) {
    await this.session.run(
      `
      MATCH (u:User {id: $userId})
      MERGE (p:Produto {
        id: $id, name: $name, description: $description, price: $price
      })
      MERGE (u)-[:FAVORITOU]->(p)
      `,
      { userId, ...product }
    );
  }

  async addPurchase(userId: string, purchase: Purchase) {
    await this.session.run(
      `
      MATCH (u:User {id: $userId})
      MERGE (p:Produto { id: $id, name: $name, price: $price })
      MERGE (u)-[r:COMPROU]->(p)
      SET r.quantity = $quantity, r.totalPrice = $totalPrice
      `,
      { userId, ...purchase }
    );
  }

  async listPurchases(userId: string) {
    const result = await this.session.run(
      `
      MATCH (u:User {id: $userId})-[r:COMPROU]->(p:Produto)
      RETURN p, r
      `,
      { userId }
    );

    return result.records.map(record => ({
      product: record.get('p').properties,
      purchaseDetails: record.get('r').properties,
    }));
  }
}
