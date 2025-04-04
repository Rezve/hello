import knex, { Knex } from 'knex';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private knex: Knex;

  // Private constructor to prevent direct instantiation
  private constructor({ host, user, password, database, port, encrypt, trustServerCertificate}: any) {
    this.knex = knex({
      client: 'mssql',
      connection: {
        host,
        user,
        password,
        database,
        port,
        options: {
            encrypt,
            trustServerCertificate
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
  public static getInstance({ host, user, password, database, port, encrypt, trustServerCertificate }: any, forcedNew = false): DatabaseConnection {
    if (forcedNew) {
      DatabaseConnection.instance = new DatabaseConnection({ host, user, password, database, port, encrypt, trustServerCertificate});
      return DatabaseConnection.instance;
    }
    
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection({ host, user, password, database, port, encrypt, trustServerCertificate});
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

export default DatabaseConnection;
