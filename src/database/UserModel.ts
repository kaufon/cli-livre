import { driver } from "./DatabaseConfiguration";
import { randomUUID } from "node:crypto";

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
	public session = driver.session();
	async addUser(
		name: string,
		email: string,
		password: string,
		address: Address,
	) {
		const id = randomUUID();
		await this.session.run(
			`
      CREATE (u:User {
        id: $id, name: $name, email: $email, password: $password,
        city: $city, street: $street, zipCode: $zipCode, number: $number
      })
      `,
			{ id, name, email, password, ...address },
		);
		return { id, name, email };
	}

	async listAllUsers() {
		const result = await this.session.run(`MATCH (u:User) RETURN u`);
		return result.records.map((r) => r.get("u").properties);
	}

	async addFavorite(userId: string, product: any) {
		await this.session.run(
			`
      MATCH (u:User {id: $userId})
      MERGE (p:Product {
        id: $id, name: $name, description: $description, price: $price
      })
      MERGE (u)-[:FAVORITOU]->(p)
      `,
			{
				userId,
				id: product.productId,
				description: product.productDescription,
				name: product.productName,
				price: product.productPrice,
			},
		);
	}

	async addPurchase(userId: string, purchase: Purchase) {
		await this.session.run(
			`
      MATCH (u:User {id: $userId})
      MERGE (p:Product { id: $id, name: $name, price: $price })
      MERGE (u)-[r:COMPROU]->(p)
      SET r.quantity = $quantity, r.totalPrice = $totalPrice
      `,
			{
				userId,
				id: purchase.productId,
				name: purchase.productName,
				price: purchase.productPrice,
				quantity: purchase.quantity,
				totalPrice: purchase.totalPrice,
			},
		);
	}

	async getUserAndFavoritesAndPurchasesByUserId(userId: string) {
		const result = await this.session.run(
			`
    MATCH (u:User {id: $userId})
    OPTIONAL MATCH (u)-[:FAVORITOU]->(f:Product)
    OPTIONAL MATCH (u)-[r:COMPROU]->(p:Product)
    RETURN u, f, r, p
    `,
			{ userId },
		);

		const userData = {
			user: null,
			favorites: [] as any[],
			purchases: [] as any[],
		};

		for (const record of result.records) {
			if (!userData.user) {
				userData.user = record.get("u")?.properties;
			}

			const fav = record.get("f")?.properties;
			if (fav && !userData.favorites.some((f) => f.name === fav.name)) {
				userData.favorites.push(fav);
			}

			const r = record.get("r")?.properties;
			const p = record.get("p")?.properties;
			if (r && p) {
				userData.purchases.push({
					quantity: r.quantity?.toNumber?.() ?? r.quantity,
					totalPrice: r.totalPrice?.toNumber?.() ?? r.totalPrice,
					productName: p.name,
				});
			}
		}

		return userData;
	}
}
