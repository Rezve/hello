import { useEffect, useRef, useState } from "react";
import { IPCService } from "../services/ipc-service";

interface LogEntry {
    id: number;
    timestamp: string;
    message: string;
  }

export interface BatchConfig {
  totalRecords: number;
  batchSize: number;
  concurrentBatches: number;
  logInterval: number;
}

const BatchConfig: React.FC = () => {

    const [isConfigOpen, setIsConfigOpen] = useState(true);
    const [totalRecords, setTotalRecords] = useState<number>(1000);
    const [batchSize, setBatchSize] = useState<number>(100);
    const [concurrentBatches, setConcurrentBatches] = useState<number>(2);
    const [logInterval, setLogInterval] = useState<number>(1000);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const handleStart = async () => {      
      const batchConfig: BatchConfig = {
        totalRecords,
        batchSize,
        concurrentBatches,
        logInterval
      }
      // TODO: add batch config validation
      await IPCService.start(batchConfig);
      setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
        IPCService.stop();
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