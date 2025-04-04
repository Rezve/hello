import DatabaseConnection from "../data-generator/connection";


export class DataGeneratorManager {
    static dbConfig = {};
    static DB:DatabaseConnection;

    static async setDBConfig(event: any, dbConfig: any) {
        try {
            this.dbConfig = dbConfig;
            this.DB = DatabaseConnection.getInstance(this.dbConfig, true);
            await this.DB.getKnex().raw('SELECT 1;')

            return { success: true }
        } catch (error: any) {
            return { success: false, message: error.message}
        }
    }

    public setGeneratorFunction() {

    }

    public setBatchConfig() {
        
    }

    public start() {

    }
}