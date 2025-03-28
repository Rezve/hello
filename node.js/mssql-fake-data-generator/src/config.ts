   export const dataConfig = {
    totalRecords: 1_000_000,
    batchSize: 340, // 2100 params / 6 columns = 350, using 340 for safety
    concurrentBatches: 4,
    logInterval: 10
  };