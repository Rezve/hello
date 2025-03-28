import { db } from "./connection";
import { DataInserter } from "./inserter";

(async () => {

  try {
    console.log('Starting database population...');
    
    // Start timing
    const startTime = Date.now();
    
    const inserter = new DataInserter(5_000_000, 100, 200, 1000);
    await inserter.insertAll()
    
    const endTime = Date.now();
    console.log(`Total records inserted: ${await inserter.getTotalCount()}`);
    console.log(`Time taken: ${((endTime - startTime) / 1000 / 60).toFixed(2)} minutes`);
    
  } catch (error) {
    console.error('Error in main execution:', error);
  } finally {
    await db.destroy();
  }
})();