import { useRef, useState } from "react";

interface LogEntry {
    id: number;
    timestamp: string;
    message: string;
  }

const BatchConfig: React.FC = () => {

    let code = ''

    const [isConfigOpen, setIsConfigOpen] = useState(true);

    const [totalRecords, setTotalRecords] = useState<number>(1000);
    const [batchSize, setBatchSize] = useState<number>(100);
    const [concurrentBatches, setConcurrentBatches] = useState<number>(2);
    const [logInterval, setLogInterval] = useState<number>(1000);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const logContainerRef = useRef<HTMLDivElement>(null);
      const workerRef = useRef<Worker | null>(null);

    const handleStart = () => {
        setIsRunning(true);
        setLogs([]);
        
        const worker = new Worker(URL.createObjectURL(
          new Blob([`
            ${code}
            self.onmessage = (e) => {
              const { total, batchSize, concurrent } = e.data;
              let generated = 0;
              
              const generateBatch = () => {
                const batch = [];
                const batchCount = Math.min(batchSize, total - generated);
                for (let i = 0; i < batchCount; i++) {
                  batch.push(generateFakeUser());
                }
                generated += batchCount;
                self.postMessage({
                  type: 'batch',
                  data: batch,
                  progress: generated / total
                });
                if (generated < total) {
                  setTimeout(generateBatch, 0);
                } else {
                  self.postMessage({ type: 'complete' });
                }
              };
              
              for (let i = 0; i < concurrent; i++) {
                generateBatch();
              }
            };
          `], { type: 'application/javascript' })
        ));
    
        workerRef.current = worker;
    
        worker.onmessage = (e) => {
          if (e.data.type === 'batch') {
            addLog(`Generated batch: ${e.data.data.length} records (Progress: ${(e.data.progress * 100).toFixed(2)}%)`);
            // Here you could add logic to send batch to database using dbConfig
          } else if (e.data.type === 'complete') {
            setIsRunning(false);
            addLog('Generation complete!');
            worker.terminate();
          }
        };
    
        worker.postMessage({
          total: totalRecords,
          batchSize,
          concurrent: concurrentBatches
        });
      };

      const handleStop = () => {
        if (workerRef.current) {
          workerRef.current.terminate();
          setIsRunning(false);
          addLog('Generation stopped by user');
        }
      };

      const addLog = (message: string) => {
        setLogs(prev => [...prev, {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          message
        }]);
      };

    return <div className={`config-section ${isConfigOpen ? 'open' : 'closed'}`}>
        <div className="section-header">
            <h2>Batch Configuration</h2>
            <button
                className="toggle-btn"
                onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
                {isConfigOpen ? '-' : '+'}
            </button>
        </div>
        <div className="section-content">
            <div className="config-grid">
                <div className="config-item">
                    <label>Total Records</label>
                    <input
                        type="number"
                        value={totalRecords}
                        onChange={(e) => setTotalRecords(Math.max(1, parseInt(e.target.value)))}
                        disabled={isRunning}
                    />
                </div>
                <div className="config-item">
                    <label>Batch Size</label>
                    <input
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value)))}
                        disabled={isRunning}
                    />
                </div>
                <div className="config-item">
                    <label>Concurrent Batches</label>
                    <input
                        type="number"
                        value={concurrentBatches}
                        onChange={(e) => setConcurrentBatches(Math.max(1, parseInt(e.target.value)))}
                        disabled={isRunning}
                    />
                </div>
                <div className="config-item">
                    <label>Log Interval (ms)</label>
                    <input
                        type="number"
                        value={logInterval}
                        onChange={(e) => setLogInterval(Math.max(100, parseInt(e.target.value)))}
                        disabled={isRunning}
                    />
                </div>
            </div>
            <div className="controls">
                <button
                    onClick={handleStart}
                    disabled={isRunning}
                    className="start-btn"
                >
                    Start
                </button>
                <button
                    onClick={handleStop}
                    disabled={!isRunning}
                    className="stop-btn"
                >
                    Stop
                </button>
            </div>
        </div>
    </div>
}

export default BatchConfig;