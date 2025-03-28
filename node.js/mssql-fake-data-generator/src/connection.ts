import knex, { Knex } from 'knex';
import { config } from 'dotenv';

// Load environment variables
config();

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private knex: Knex;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.knex = knex({
      client: 'mssql',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        options: {
            encrypt: false,
            trustServerCertificate: true
        },
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 30000,
          idleTimeoutMillis: 30000,
        }
      },
      // Additional Knex configurations
      debug: process.env.NODE_ENV === 'development',
      asyncStackTraces: process.env.NODE_ENV === 'development'
    });
  }

  // Singleton pattern to ensure single instance
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  // Get Knex instance
  public getKnex(): Knex {
    return this.knex;
  }

  // Cleanup method for graceful shutdown
  public async destroy(): Promise<void> {
    try {
      await this.knex.destroy();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
}

export const db = DatabaseConnection.getInstance();
