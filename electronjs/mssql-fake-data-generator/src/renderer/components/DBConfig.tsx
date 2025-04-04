import { useEffect, useState } from "react";
import { IPCService } from "../services/ipc-service";
import { useNotification } from "./notification/NotificationContext";

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
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotification();

  // Database configuration state
  const [dbConfig, setDbConfig] = useState<DBConfig>({
    host: "localhost",
    user: "test_user",
    password: "",
    database: "Exp_Test",
    port: 1433,
    encrypt: false,
    trustServerCertificate: true,
  });

  const handleDbConfigChange = (
    field: keyof DBConfig,
    value: string | number | boolean
  ) => {
    setDbConfig((prev) => ({ ...prev, [field]: value }));
  };

  const saveConfig = async (dbConfig: any) => {
    await IPCService.saveDBConfig(dbConfig);
  }

    useEffect(() => {
      async function loadData() {
        const config = await IPCService.loadConfig();
        if (!config) {
          setDbConfig({
            host: "localhost",
            user: "test_user",
            password: "",
            database: "test-db",
            port: 1433,
            encrypt: false,
            trustServerCertificate: true,
          })

          return;
        }

        setDbConfig(config as any)
      }
      
      loadData();
    }, []);

  const connect = async () => {
    const response = await IPCService.setDBConfig(dbConfig) as any;
    console.log('Response: ', isConnected, response.success)
    if (response.success  == true ) {
        setIsConnected(true)
        addNotification('Collection Established Successfully', 'success')
        setIsDbConfigOpen(false);
        await saveConfig(dbConfig);
        return;
      }
      addNotification(`Error: ${response.message}`, 'error')
  }

  return (
    <div className={`db-config-section ${isDbConfigOpen ? "open" : "closed"}`}>
      <div className="section-header">
        <h2>Database Configuration</h2>
        <button
          className="toggle-btn"
          onClick={() => setIsDbConfigOpen(!isDbConfigOpen)}
        >
          {isDbConfigOpen ? "-" : "+"}
        </button>
      </div>
      <div className="section-content">
        <div className="config-grid">
          <div className="config-item">
            <label>Host</label>
            <input
              type="text"
              value={dbConfig.host}
              onChange={(e) => handleDbConfigChange("host", e.target.value)}
              disabled={isConnected}
            />
          </div>
          <div className="config-item">
            <label>User</label>
            <input
              type="text"
              value={dbConfig.user}
              onChange={(e) => handleDbConfigChange("user", e.target.value)}
              disabled={isConnected}
            />
          </div>
          <div className="config-item">
            <label>Password</label>
            <input
              type="password"
              value={dbConfig.password}
              onChange={(e) => handleDbConfigChange("password", e.target.value)}
              disabled={isConnected}
            />
          </div>
          <div className="config-item">
            <label>Database</label>
            <input
              type="text"
              value={dbConfig.database}
              onChange={(e) => handleDbConfigChange("database", e.target.value)}
              disabled={isConnected}
            />
          </div>
          <div className="config-item">
            <label>Port</label>
            <input
              type="number"
              value={dbConfig.port}
              onChange={(e) =>
                handleDbConfigChange("port", parseInt(e.target.value))
              }
              disabled={isConnected}
            />
          </div>
          <div className="config-item checkbox-item">
            <label>Encrypt</label>
            <input
              type="checkbox"
              checked={dbConfig.encrypt}
              onChange={(e) =>
                handleDbConfigChange("encrypt", e.target.checked)
              }
              disabled={isConnected}
            />
             <label>Trust Server Certificate</label>
            <input
              type="checkbox"
              checked={dbConfig.trustServerCertificate}
              onChange={(e) =>
                handleDbConfigChange("trustServerCertificate", e.target.checked)
              }
              disabled={isConnected}
            />
          </div>
          <div className="config-item">
            <button
              className={`py-2 px-4 rounded-lg font-semibold text-white transition duration-200 ${
                isConnected
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
              disabled={isConnected}
              onClick={connect}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBConfig;
