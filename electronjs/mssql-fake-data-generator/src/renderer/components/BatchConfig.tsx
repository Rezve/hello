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

    useEffect(() => {
        const handleProgress = (data: any) => {
            setIsRunning(false);
        };
        window.electronAPI.on('app:complete', handleProgress);
      }, []);

      return (
        <div
          className={`config-section ${
            isConfigOpen ? "open" : "closed"
          } bg-white border border-gray-300 rounded-md shadow-sm`}
        >
          {/* Section Header */}
          <div className="section-header flex items-center justify-between p-2 bg-gray-200 border-b border-gray-300">
            <h2 className="text-sm font-semibold text-gray-800">Batch Configuration</h2>
            <button
              className="toggle-btn w-6 h-6 flex items-center justify-center text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
              {isConfigOpen ? "-" : "+"}
            </button>
          </div>
      
          {/* Section Content (Visible when open) */}
          {isConfigOpen && (
            <div className="section-content p-4">
              <div className="config-grid grid grid-cols-2 gap-4">
                {/* Total Records */}
                <div className="config-item flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Total Records</label>
                  <input
                    type="number"
                    value={totalRecords}
                    onChange={(e) => setTotalRecords(Math.max(1, parseInt(e.target.value)))}
                    disabled={isRunning}
                    className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
                  />
                </div>
      
                {/* Batch Size */}
                <div className="config-item flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Batch Size</label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value)))}
                    disabled={isRunning}
                    className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
                  />
                </div>
      
                {/* Concurrent Batches */}
                <div className="config-item flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Concurrent Batches</label>
                  <input
                    type="number"
                    value={concurrentBatches}
                    onChange={(e) => setConcurrentBatches(Math.max(1, parseInt(e.target.value)))}
                    disabled={isRunning}
                    className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
                  />
                </div>
      
                {/* Log Interval */}
                <div className="config-item flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Log Interval (ms)</label>
                  <input
                    type="number"
                    value={logInterval}
                    onChange={(e) => setLogInterval(Math.max(100, parseInt(e.target.value)))}
                    disabled={isRunning}
                    className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
                  />
                </div>
              </div>
      
              {/* Controls */}
              <div className="controls mt-4 flex space-x-2">
                <button
                  onClick={handleStart}
                  disabled={isRunning}
                  className={`w-full py-2 px-4 text-sm font-semibold text-white rounded-md shadow-sm transition-colors duration-200 ${
                    isRunning
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }`}
                >
                  Start
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className={`w-full py-2 px-4 text-sm font-semibold text-white rounded-md shadow-sm transition-colors duration-200 ${
                    !isRunning
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  }`}
                >
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>
      );
}

export default BatchConfig;