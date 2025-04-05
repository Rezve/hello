import { useEffect, useRef, useState } from "react";

interface LogEntry {
    id: number;
    timestamp: string;
    message: string;
  }

const LiveLog: React.FC = () => {

    const [isLogsOpen, setIsLogsOpen] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const addLog = (message: string) => {
      setLogs(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message
      }]);
    };

     useEffect(() => {
      const handleProgress = (data: any) => {
        addLog(data.log)
      };
      window.electronAPI.on('app:progress', handleProgress);
    }, []);

    useEffect(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, [logs]);

    return <div className={`log-section ${isLogsOpen ? 'open' : 'closed'}`}>
    <div className="section-header">
      <h2>Live Logs</h2>
      <button 
        className="toggle-btn" 
        onClick={() => setIsLogsOpen(!isLogsOpen)}
      >
        {isLogsOpen ? '-' : '+'}
      </button>
    </div>
    <div className="section-content">
      <div
        className="log-container bg-white shadow-md rounded-lg p-4 h-64 overflow-y-auto"
        ref={logContainerRef}
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className="log-entry flex space-x-2 text-sm border-b py-1 last:border-b-0"
          >
            <span className="timestamp text-gray-500 font-mono">
              {log.timestamp}
            </span>
            <span className="message text-gray-800">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
}

export default LiveLog;