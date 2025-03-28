import { db as database } from "./connection";

export async function initializeSchema(): Promise<void> {
  const db = database.getKnex();
  
  await db.schema.dropTableIfExists('Users');
  
  await db.schema.createTable('Users', (table) => {
    table.increments('id').primary();
    table.string('Name', 100).notNullable();
    table.string('Email', 100).notNullable();
    table.string('Phone', 20);
    table.string('Address', 200);
    table.dateTime('CreatedAt').notNullable();
    table.dateTime('UpdatedAt').notNullable();
    table.unique('Email', { indexName: 'IX_Users_Email' });
  });
  
  await db.schema.table('Users', (table) => {
    table.index(['CreatedAt'], 'IX_Users_CreatedAt');
  });
}