import type { Client } from "cassandra-driver";
import { v4 as uuidv4 } from "uuid";

type Address = {
	city: string;
	street: string;
	zipCode: string;
	number: string;
};

type Product = {
	productId: string;
	name: string;
	description: string;
	price: number;
};

type Sells = {
	sellId?: string;
	productId?: string;
	productName: string;
	quantity: number;
	price: number;
};

type UpdateSellerParams = {
	id: string;
	name?: string;
	email?: string;
	password?: string;
	address?: Address;
};

export class SellerModel {
	constructor(private client: Client) {}

	async addSeller(
		name: string,
		address: Address,
		email: string,
		password: string,
	) {
		const id = uuidv4();
		const query = `
      INSERT INTO sellers (id, name, email, password, city, street, zipCode, number)
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

	async listAllSellers() {
		const result = await this.client.execute("SELECT * FROM sellers");
		return result.rows;
	}

	async deleteSeller(id: string) {
		await this.client.execute("DELETE FROM sellers WHERE id = ?", [id]);
	}

	async updateSeller({
		id,
		name,
		email,
		password,
		address,
	}: UpdateSellerParams) {
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

		const query = `UPDATE sellers SET ${updates.join(", ")} WHERE id = ?`;
		values.push(id);
		await this.client.execute(query, values);
	}

	async addProduct(product: Product, sellerId: string) {
		const query = `
      INSERT INTO seller_products (seller_id, product_id, name, description, price)
      VALUES (?, ?, ?, ?, ?)
    `;
		await this.client.execute(query, [
			sellerId,
			product.productId,
			product.name,
			product.description,
			product.price,
		]);
	}

	async removeProduct(productId: string, sellerId: string) {
		const query =
			"DELETE FROM seller_products WHERE seller_id = ? AND product_id = ?";
		await this.client.execute(query, [sellerId, productId]);
	}

	async updateSellerProduct(
		sellerId: string,
		productId: string,
		updates: Partial<Omit<Product, "productId">>,
	) {
		const fields: string[] = [];
		const values: string[] = [];

		if (updates.name) {
			fields.push("name = ?");
			values.push(updates.name);
		}
		if (updates.description) {
			fields.push("description = ?");
			values.push(updates.description);
		}
		if (updates.price !== undefined) {
			fields.push("price = ?");
			values.push(updates.price.toString());
		}

		const query = `UPDATE seller_products SET ${fields.join(", ")} WHERE seller_id = ? AND product_id = ?`;
		values.push(sellerId, productId);
		await this.client.execute(query, values);
	}

	async addSell(sellerId: string, sell:Sells) {
		const query = `
      INSERT INTO seller_sells (seller_id, sell_id, product_id, product_name, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
		await this.client.execute(query, [
			sellerId,
			sell.sellId,
			sell.productId,
			sell.productName,
			sell.quantity,
			sell.price,
		]);
	}

	async removeSell(sellerId: string, sellId: string) {
		const query =
			"DELETE FROM seller_sells WHERE seller_id = ? AND sell_id = ?";
		await this.client.execute(query, [sellerId, sellId]);
	}

	async findSellerIdByProductId(productId: string): Promise<string | null> {
		const query =
			"SELECT seller_id FROM seller_products WHERE product_id = ? ALLOW FILTERING";
		const result = await this.client.execute(query, [productId]);
		const row = result.first();
		return row ? row.seller_id : null;
	}
	async findSellerWithProducts(sellerId: string) {
		const sellerResult = await this.client.execute(
			"SELECT * FROM MercadoLivre.sellers WHERE id = ?",
			[sellerId],
		);
		const seller = sellerResult.first();
		if (!seller) return null;

		const productsResult = await this.client.execute(
			"SELECT * FROM MercadoLivre.seller_products WHERE seller_id = ?",
			[sellerId],
		);
		const products = productsResult.rows;

		return {
			...seller,
			products,
		};
	}
}
