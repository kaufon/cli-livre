import type { Client } from "cassandra-driver";
import { v4 as uuidv4 } from "uuid";

type Address = {
	city: string;
	street: string;
	zipCode: string;
	number: string;
};

type Seller = {
	id: string;
	name: string;
	address: Address;
};

export type ProductDocument = {
	id?: string;
	name: string;
	seller: Seller;
	price: number;
	description: string;
};

export class ProductModel {
	constructor(private client: Client) {}

	async addProduct(product: ProductDocument): Promise<ProductDocument> {
		const id = uuidv4();
		const query = `
      INSERT INTO products (
        id, name, seller_id, seller_name, price, description,
        seller_city, seller_street, seller_zip, seller_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

		const params = [
			id,
			product.name,
			product.seller.id,
			product.seller.name,
			product.price,
			product.description,
			product.seller.address.city,
			product.seller.address.street,
			product.seller.address.zipCode,
			product.seller.address.number,
		];

		await this.client.execute(query, params, { prepare: true });
		return { ...product, id };
	}

	async getProductById(id: string): Promise<ProductDocument | null> {
		const query = "SELECT * FROM products WHERE id = ?";
		const result = await this.client.execute(query, [id], { prepare: true });

		if (!result.rowLength) return null;

		const row = result.first();

		return {
			id: row.id,
			name: row.name,
			price: row.price,
			description: row.description,
			seller: {
				id: row.seller_id,
				name: row.seller_name,
				address: {
					city: row.seller_city,
					street: row.seller_street,
					zipCode: row.seller_zip,
					number: row.seller_number,
				},
			},
		};
	}

	async deleteProductById(id: string): Promise<boolean> {
		const query = "DELETE FROM products WHERE id = ?";
		await this.client.execute(query, [id], { prepare: true });
		return true;
	}

	async updateProductById(
		id: string,
		updates: Partial<ProductDocument>,
	): Promise<boolean> {
		const fields: string[] = [];
		const values: any[] = [];

		if (updates.name) {
			fields.push("name = ?");
			values.push(updates.name);
		}
		if (updates.price !== undefined) {
			fields.push("price = ?");
			values.push(updates.price);
		}
		if (updates.description) {
			fields.push("description = ?");
			values.push(updates.description);
		}

		if (updates.seller) {
			if (updates.seller.name) {
				fields.push("seller_name = ?");
				values.push(updates.seller.name);
			}
			if (updates.seller.address) {
				const { city, street, zipCode, number } = updates.seller.address;
				if (city) {
					fields.push("seller_city = ?");
					values.push(city);
				}
				if (street) {
					fields.push("seller_street = ?");
					values.push(street);
				}
				if (zipCode) {
					fields.push("seller_zip = ?");
					values.push(zipCode);
				}
				if (number) {
					fields.push("seller_number = ?");
					values.push(number);
				}
			}
		}

		if (!fields.length) return false;

		const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;
		values.push(id);

		await this.client.execute(query, values, { prepare: true });
		return true;
	}

	async listAll(): Promise<ProductDocument[]> {
		const query = "SELECT * FROM products";
		const result = await this.client.execute(query);

		return result.rows.map((row) => ({
			id: row.id,
			name: row.name,
			price: row.price,
			description: row.description,
			seller: {
				id: row.seller_id,
				name: row.seller_name,
				address: {
					city: row.seller_city,
					street: row.seller_street,
					zipCode: row.seller_zip,
					number: row.seller_number,
				},
			},
		}));
	}
}
