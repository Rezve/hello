import { BatchConfig } from "../renderer/components/BatchConfig";
import DatabaseConnection from "../data-generator/connection";
import { BrowserWindow } from "electron";
import { DataInserter } from "../data-generator/inserter";
import vm from 'vm';
import { faker } from '@faker-js/faker';


export class DataGeneratorManager {
    static dbConfig = {};
    static DB: DatabaseConnection;
    static inserter: DataInserter;
    static userFunctionToGenerateData: any;
    static sandbox = {
        require: (module: any) => {
          if (module === '@faker-js/faker') return { faker };
          throw new Error('Only @faker-js/faker is allowed');
        },
        module: { exports: {} }, // Mimic CommonJS module
        exports: {} as any, // Shortcut for module.exports
    };

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

    static async setGeneratorFunction(window: BrowserWindow, userCode: any) {
        try {
            const wrappedCode = `
            (function (module, exports, require) {
                ${userCode}
                if (typeof generateFakeData === 'function') {
                exports.generateFakeData = generateFakeData;
                }
            })(module, exports, require);
            `;

            // Run the user code once
            const script = new vm.Script(wrappedCode);
            const context = vm.createContext(this.sandbox);
            script.runInContext(context);
        
            // Verify the function exists
            this.userFunctionToGenerateData = this.sandbox.exports.generateFakeData;
            if (typeof this.userFunctionToGenerateData !== 'function') {
                window.webContents.send('app:code:result', { error: 'You must export a function named "generateFakeData"' })
            }

            // Generate data once and reply
            const fakeDataArray = Array.from({ length: 1 }, () => this.userFunctionToGenerateData());
            window.webContents.send('app:code:result', fakeDataArray)
        } catch (error: any) {
            window.webContents.send('app:code:result', { error: error.message })
        }
    }

    static async start(window: BrowserWindow, batchConfig: BatchConfig) {
        if (!this.DB) {
            return;
        }
        const { totalRecords, batchSize, concurrentBatches, logInterval } = batchConfig;
        this.inserter = new DataInserter(this.DB, totalRecords, batchSize, concurrentBatches, logInterval);
        await this.inserter.insertAll(window, this.userFunctionToGenerateData)
        window.webContents.send('app:progress', { log: `Operation Done`})
        window.webContents.send('app:complete', {})
    }

    static stop(window: BrowserWindow) {
        this.inserter?.stop();
        window.webContents.send('app:progress', { log: 'Operation stopped by user'})
    }

    static async sleep(sec: number) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }
}