import { useState } from "react";

interface DBConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
    encrypt: boolean;
    trustServerCertificate: boolean;
  }

const DBConfig: React.FC = () => {

     const [isDbConfigOpen, setIsDbConfigOpen] = useState(true);
     let isRunning = true;

     
       // Database configuration state
       const [dbConfig, setDbConfig] = useState<DBConfig>({
         host: 'localhost',
         user: 'root',
         password: '',
         database: 'test_db',
         port: 3306,
         encrypt: false,
         trustServerCertificate: false,
       });

      const handleDbConfigChange = (field: keyof DBConfig, value: string | number | boolean) => {
        setDbConfig(prev => ({ ...prev, [field]: value }));
      };

    return <div className={`db-config-section ${isDbConfigOpen ? 'open' : 'closed'}`}>
    <div className="section-header">
      <h2>Database Configuration</h2>
      <button 
        className="toggle-btn" 
        onClick={() => setIsDbConfigOpen(!isDbConfigOpen)}
      >
        {isDbConfigOpen ? '-' : '+'}
      </button>
    </div>
    <div className="section-content">
      <div className="config-grid">
        <div className="config-item">
          <label>Host</label>
          <input
            type="text"
            value={dbConfig.host}
            onChange={(e) => handleDbConfigChange('host', e.target.value)}
            disabled={isRunning}
          />
        </div>
        <div className="config-item">
          <label>User</label>
          <input
            type="text"
            value={dbConfig.user}
            onChange={(e) => handleDbConfigChange('user', e.target.value)}
            disabled={isRunning}
          />
        </div>
        <div className="config-item">
          <label>Password</label>
          <input
            type="password"
            value={dbConfig.password}
            onChange={(e) => handleDbConfigChange('password', e.target.value)}
            disabled={isRunning}
          />
        </div>
        <div className="config-item">
          <label>Database</label>
          <input
            type="text"
            value={dbConfig.database}
            onChange={(e) => handleDbConfigChange('database', e.target.value)}
            disabled={isRunning}
          />
        </div>
        <div className="config-item">
          <label>Port</label>
          <input
            type="number"
            value={dbConfig.port}
            onChange={(e) => handleDbConfigChange('port', parseInt(e.target.value))}
            disabled={isRunning}
          />
        </div>
        <div className="config-item checkbox-item">
          <label>Encrypt</label>
          <input
            type="checkbox"
            checked={dbConfig.encrypt}
            onChange={(e) => handleDbConfigChange('encrypt', e.target.checked)}
            disabled={isRunning}
          />
        </div>
        <div className="config-item checkbox-item">
          <label>Trust Server Certificate</label>
          <input
            type="checkbox"
            checked={dbConfig.trustServerCertificate}
            onChange={(e) => handleDbConfigChange('trustServerCertificate', e.target.checked)}
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  </div>
}

export default DBConfig;