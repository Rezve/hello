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

interface DBConfigProps {
  isConnected: boolean;
  setIsConnected: (flag: boolean) => void;
}

const DBConfig: React.FC<DBConfigProps> = ({ isConnected, setIsConnected }: any) => {
  const [isDbConfigOpen, setIsDbConfigOpen] = useState(true);
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
    if (response.success  == true ) {
        setIsConnected(true)
        addNotification('Collection Established Successfully', 'success')
        setIsDbConfigOpen(false);
        await saveConfig(dbConfig);
        setIsConnected(true);
        return;
      }
      addNotification(`Error: ${response.message}`, 'error')
  }

  return (
    <div
      className={`db-config-section ${
        isDbConfigOpen ? "open" : "closed"
      } bg-white border border-gray-300 rounded-md shadow-sm`}
    >
      {/* Section Header */}
      <div className="section-header flex items-center justify-between p-2 bg-gray-200 border-b border-gray-300">
        <h2 className="text-sm font-semibold text-gray-800">Database Configuration</h2>
        <button
          className="toggle-btn w-6 h-6 flex items-center justify-center text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
          onClick={() => setIsDbConfigOpen(!isDbConfigOpen)}
        >
          {isDbConfigOpen ? "-" : "+"}
        </button>
      </div>
  
      {/* Section Content (Visible when open) */}
      {isDbConfigOpen && (
        <div className="section-content p-4">
          <div className="config-grid grid grid-cols-2 gap-4">
            {/* Host */}
            <div className="config-item flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Host</label>
              <input
                type="text"
                value={dbConfig.host}
                onChange={(e) => handleDbConfigChange("host", e.target.value)}
                disabled={isConnected}
                className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
              />
            </div>
  
            {/* User */}
            <div className="config-item flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">User</label>
              <input
                type="text"
                value={dbConfig.user}
                onChange={(e) => handleDbConfigChange("user", e.target.value)}
                disabled={isConnected}
                className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
              />
            </div>
  
            {/* Password */}
            <div className="config-item flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={dbConfig.password}
                onChange={(e) => handleDbConfigChange("password", e.target.value)}
                disabled={isConnected}
                className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
              />
            </div>
  
            {/* Database */}
            <div className="config-item flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Database</label>
              <input
                type="text"
                value={dbConfig.database}
                onChange={(e) => handleDbConfigChange("database", e.target.value)}
                disabled={isConnected}
                className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
              />
            </div>
  
            {/* Port */}
            <div className="config-item flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Port</label>
              <input
                type="number"
                value={dbConfig.port}
                onChange={(e) => handleDbConfigChange("port", parseInt(e.target.value))}
                disabled={isConnected}
                className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
              />
            </div>
  
            {/* Checkboxes */}
            <div className="config-item checkbox-item flex flex-col space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={dbConfig.encrypt}
                  onChange={(e) => handleDbConfigChange("encrypt", e.target.checked)}
                  disabled={isConnected}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:text-gray-400"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Encrypt</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={dbConfig.trustServerCertificate}
                  onChange={(e) =>
                    handleDbConfigChange("trustServerCertificate", e.target.checked)
                  }
                  disabled={isConnected}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:text-gray-400"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Trust Server Certificate
                </label>
              </div>
            </div>
  
            {/* Connect Button */}
            <div className="config-item flex items-end">
              <button
                className={`w-full py-2 px-4 text-sm font-semibold text-white rounded-md shadow-sm transition-colors duration-200 ${
                  isConnected
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
                disabled={isConnected}
                onClick={connect}
              >
                {isConnected ? "Connected" : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DBConfig;
