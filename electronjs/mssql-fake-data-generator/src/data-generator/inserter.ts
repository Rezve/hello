import { Knex } from "knex";
import DatabaseConnection from "./connection";
import { generateBatch } from "./data-generator";
import { User } from "./types";
import { BrowserWindow } from "electron";

export class DataInserter {   
    private db: Knex;
    private shouldStopProcess: boolean;
  
    constructor(
      private DBConnection: DatabaseConnection,
      private totalRecords: number,
      private batchSize: number,
      private concurrentBatches: number,
      private logInterval: number
    ) {
      this.db = this.DBConnection.getKnex();
      this.shouldStopProcess = false;
    }

    public stop() {
      this.shouldStopProcess = true;
    }
  
    private async insertSingleBatch(users: User[]): Promise<number> {
      try {
        await this.db('Users').insert(users);
        return users.length;
      } catch (error: any) {
        throw error;
      }
    }
  
    public async insertAll(window: BrowserWindow): Promise<number> {
      this.shouldStopProcess = false;

      const totalBatches = Math.ceil(this.totalRecords / this.batchSize);
      let insertedRecords = 0;
      const batchPromises: Promise<number>[] = [];
  
      for (let i = 0; i < totalBatches; i += this.concurrentBatches) {
        const currentBatchSize = Math.min(this.concurrentBatches, totalBatches - i);

        if (this.shouldStopProcess) {
          break;
        }

        for (let j = 0; j < currentBatchSize; j++) {
          const batchIndex = i + j;
          const recordsToGenerate = Math.min(
            this.batchSize,
            this.totalRecords - (batchIndex * this.batchSize)
          );

          if (this.shouldStopProcess) {
            break;
          }
          
          if (recordsToGenerate > 0) {
            const users = generateBatch(recordsToGenerate);
            batchPromises.push(
              this.insertSingleBatch(users).then(count => {
                insertedRecords += count;
                if (batchIndex % this.logInterval === 0) {
                  // console.log(`Progress: ${insertedRecords}/${this.totalRecords}`);
                  window.webContents.send('app:progress', { log: `Progress: ${insertedRecords}/${this.totalRecords}`})
                }
                return count;
              })
            );
          }
        }
        
        await Promise.all(batchPromises.splice(0));
        await new Promise(resolve => setTimeout(resolve, 1));
      }
  
      return insertedRecords;
    }
  
    public async getTotalCount(): Promise<number> {
      const result = await this.db('Users').count('UserId as total').first();
      return Number(result?.total) || 0;
    }
  }