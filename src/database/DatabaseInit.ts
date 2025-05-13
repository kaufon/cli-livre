import { client } from "./DatabaseConfiguration"; // Make sure path is correct

// Function to create keyspace
export const createKeyspace = async () => {
	const createKeyspaceQuery = `
    CREATE KEYSPACE IF NOT EXISTS MercadoLivre
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
  `;
	try {
		await client.execute(createKeyspaceQuery);
		console.log("✅ Keyspace 'MercadoLivre' criada (ou ja existe XD)");
	} catch (error) {
		console.error("❌ Error creating keyspace:", error);
		throw error; // Let the caller handle the error
	}
};

// Function to create tables
export const createTables = async () => {
	const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS MercadoLivre.users (
      id UUID PRIMARY KEY,
      name TEXT,
      email TEXT,
      password TEXT,
      city TEXT,
      street TEXT,
      zipCode TEXT,
      number TEXT
    );
  `;

	const createFavoritesTableQuery = `
    CREATE TABLE IF NOT EXISTS MercadoLivre.favorites (
      user_id UUID,
      product_id UUID,
      product_name TEXT,
      product_description TEXT,
      product_price DECIMAL,
      PRIMARY KEY (user_id, product_id)
    );
  `;

	const createPurchasesTableQuery = `
    CREATE TABLE IF NOT EXISTS MercadoLivre.purchases (
      user_id UUID,
      purchase_id UUID,
      product_id UUID,
      product_name TEXT,
      product_price DECIMAL,
      quantity BIGINT,
      total_price DECIMAL,
      PRIMARY KEY (user_id, purchase_id)
    );
  `;

	const createProductsTableQuery = `
CREATE TABLE IF NOT EXISTS MercadoLivre.products (
  id UUID PRIMARY KEY,
  name TEXT,
  seller_id UUID,
  seller_name TEXT,
  seller_city TEXT,
  seller_street TEXT,
  seller_zip TEXT,
  seller_number TEXT,
  price DECIMAL,
  description TEXT
);
  `;
	const createSellersTableQuery = `
    CREATE TABLE IF NOT EXISTS MercadoLivre.sellers (
      id UUID PRIMARY KEY,
      name TEXT,
      email TEXT,
      password TEXT,
      city TEXT,
      street TEXT,
      zipCode TEXT,
      number TEXT
    );
  `;

	const createSellerProductsTableQuery = `
    CREATE TABLE IF NOT EXISTS MercadoLivre.seller_products (
      seller_id UUID,
      product_id UUID,
      name TEXT,
      description TEXT,
      price DECIMAL,
      PRIMARY KEY (seller_id, product_id)
    );
  `;

	const createSellerSellsTableQuery = `
    CREATE TABLE IF NOT EXISTS MercadoLivre.seller_sells (
      seller_id UUID,
      sell_id UUID,
      product_id UUID,
      product_name TEXT,
      quantity BIGINT,
      price DECIMAL,
      PRIMARY KEY (seller_id, sell_id)
    );
  `;

	// Add other table creation queries here for your schema
	try {
		await client.execute(createUsersTableQuery);
		await client.execute(createFavoritesTableQuery);
		await client.execute(createPurchasesTableQuery);
    await client.execute(createSellersTableQuery);
    await client.execute(createSellerProductsTableQuery);
    await client.execute(createSellerSellsTableQuery);
		await client.execute(createProductsTableQuery);
		console.log("✅ Tables created or already exist.");
	} catch (error) {
		console.error("❌ Error creating tables:", error);
		throw error; // Let the caller handle the error
	}
};
