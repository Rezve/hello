import { BatchConfig } from "../renderer/components/BatchConfig";
import DatabaseConnection from "../data-generator/connection";
import { BrowserWindow } from "electron";
import { DataInserter } from "../data-generator/inserter";


export class DataGeneratorManager {
    static dbConfig = {};
    static DB: DatabaseConnection;
    static inserter: DataInserter;

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

    static async start(window: BrowserWindow, batchConfig: BatchConfig) {
        const { totalRecords, batchSize, concurrentBatches, logInterval } = batchConfig;
        this.inserter = new DataInserter(this.DB, totalRecords, batchSize, concurrentBatches, logInterval);
        await this.inserter.insertAll(window)
        window.webContents.send('app:progress', { log: `Total ${totalRecords} Rows Insertion Complete`})
        window.webContents.send('app:complete', {})
    }

    static stop(window: BrowserWindow) {
        this.inserter.stop();
        window.webContents.send('app:progress', { log: 'Operation stopped by user'})
    }

    static async sleep(sec: number) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }
}