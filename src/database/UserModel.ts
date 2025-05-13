import type { Client } from "cassandra-driver";
import { v4 as uuidv4 } from "uuid";

type Address = {
	city: string;
	street: string;
	zipCode: string;
	number: string;
};

type FavoriteProduct = {
	productId: string;
	productName: string;
	productDescription: string;
	productPrice: number;
};

type Purchases = {
	purchaseId: string;
	productId?: string;
	productName: string;
	productPrice: number;
	quantity: number;
	totalPrice: number;
};

type UpdateUserParams = {
	id: string;
	name?: string;
	email?: string;
	password?: string;
	address?: Address;
};

export class UserModel {
	constructor(private client: Client) {}

	async addUser(
		name: string,
		email: string,
		password: string,
		address: Address,
	) {
		const id = uuidv4();
		const query = `
      INSERT INTO users (id, name, email, password, city, street, zipCode, number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
		await this.client.execute(query, [
			id,
			name,
			email,
			password,
			address.city,
			address.street,
			address.zipCode,
			address.number,
		]);
		return id;
	}

	async listAllUsers() {
		const result = await this.client.execute("SELECT * FROM users");
		return result.rows;
	}

	async deleteUser(id: string) {
		await this.client.execute("DELETE FROM users WHERE id = ?", [id]);
	}

	async updateUser({ id, name, email, password, address }: UpdateUserParams) {
		const updates: string[] = [];
		const values: any[] = [];

		if (name) {
			updates.push("name = ?");
			values.push(name);
		}
		if (email) {
			updates.push("email = ?");
			values.push(email);
		}
		if (password) {
			updates.push("password = ?");
			values.push(password);
		}
		if (address) {
			updates.push("city = ?, street = ?, zipCode = ?, number = ?");
			values.push(
				address.city,
				address.street,
				address.zipCode,
				address.number,
			);
		}

		const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
		values.push(id);
		await this.client.execute(query, values);
	}

	async addFavorite(userId: string, product: FavoriteProduct) {
		const query = `
      INSERT INTO favorites (user_id, product_id, product_name, product_description, product_price)
      VALUES (?, ?, ?, ?, ?)
    `;
		await this.client.execute(query, [
			userId,
			product.productId,
			product.productName,
			product.productDescription,
			product.productPrice,
		]);
	}

	async removeFavorite(userId: string, productId: string) {
		const query = "DELETE FROM favorites WHERE user_id = ? AND product_id = ?";
		await this.client.execute(query, [userId, productId]);
	}

	async addPurchase(userId: string, purchase: Purchases) {
		const query = `
      INSERT INTO purchases (user_id, purchase_id, product_id, product_name, product_price, quantity, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
		await this.client.execute(query, [
			userId,
			purchase.purchaseId,
			purchase.productId,
			purchase.productName,
			purchase.productPrice,
			purchase.quantity,
			purchase.totalPrice,
		]);
	}

	async listPurchases(userId: string) {
		const result = await this.client.execute(
			"SELECT * FROM purchases WHERE user_id = ?",
			[userId],
		);
		return result.rows;
	}

	async cancelPurchase(userId: string, purchaseId: string) {
		await this.client.execute(
			"DELETE FROM purchases WHERE user_id = ? AND purchase_id = ?",
			[userId, purchaseId],
		);
	}
	async findUserWithRelations(userId: string): Promise<any> {
		const userResult = await this.client.execute(
			"SELECT * FROM MercadoLivre.users WHERE id = ?",
			[userId],
		);
		const user = userResult.first();
		if (!user) return null;

		const favoritesResult = await this.client.execute(
			"SELECT * FROM MercadoLivre.favorites WHERE user_id = ?",
			[userId],
		);
		const purchasesResult = await this.client.execute(
			"SELECT * FROM MercadoLivre.purchases WHERE user_id = ?",
			[userId],
		);

		return {
			...user,
			favorites: favoritesResult.rows,
			purchases: purchasesResult.rows,
		};
	}
}
