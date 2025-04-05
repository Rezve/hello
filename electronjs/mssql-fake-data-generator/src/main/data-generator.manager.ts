import { BatchConfig } from "../renderer/components/BatchConfig";
import DatabaseConnection from "../data-generator/connection";
import { BrowserWindow } from "electron";


export class DataGeneratorManager {
    static dbConfig = {};
    static DB:DatabaseConnection;
    static shouldStopProcess: boolean = false;

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
        this.shouldStopProcess = false;

        for (let index = 0; index < 60; index++) {
            if (this.shouldStopProcess) {
                console.log('Process stopped by user')
                break;
            }

            await this.sleep(1);


            window.webContents.send('app:progress', { log: 'hello ' + index})

            console.log('Working....'+ index)
        }
    }

    static stop(window: BrowserWindow) {
        this.shouldStopProcess = true;
        window.webContents.send('app:progress', { log: 'Operation stopped by user'})
    }

    static async sleep(sec: number) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }
}