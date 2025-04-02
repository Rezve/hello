import { useRef, useState } from "react";


interface LogEntry {
    id: number;
    timestamp: string;
    message: string;
  }

const LiveLog: React.FC = () => {

    const [isLogsOpen, setIsLogsOpen] = useState(true);

    const [logs, setLogs] = useState<LogEntry[]>([]);

     const logContainerRef = useRef<HTMLDivElement>(null);

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
      <div className="log-container" ref={logContainerRef}>
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <span className="timestamp">{log.timestamp}</span>
            <span className="message">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
}

export default LiveLog;