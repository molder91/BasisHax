import React, { useState, useEffect } from 'react';
import { WifiOff, Monitor, MonitorX, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [wifiStatus, setWifiStatus] = useState<boolean | null>(null);
  const [hiddenApps, setHiddenApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const status = await window.electronAPI.getWiFiStatus();
      const apps = await window.electronAPI.getHiddenApps();
      
      setWifiStatus(status);
      setHiddenApps(apps);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button 
          onClick={fetchData} 
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Refresh"
          tabIndex={0}
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WiFi Status */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium mb-2">WiFi Status</h2>
                  <p className={`text-2xl font-bold ${wifiStatus ? 'text-green-500' : 'text-red-500'}`}>
                    {wifiStatus ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${wifiStatus ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <WifiOff className={`h-6 w-6 ${wifiStatus ? 'opacity-0' : 'opacity-100'}`} />
                </div>
              </div>
            </div>
            
            {/* Hidden Applications */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium mb-2">Hidden Applications</h2>
                  <p className="text-2xl font-bold">
                    {hiddenApps.length} {hiddenApps.length === 1 ? 'App' : 'Apps'}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <MonitorX className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Hidden Apps List */}
          {hiddenApps.length > 0 && (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
              <h2 className="text-lg font-medium p-4 border-b border-zinc-200 dark:border-zinc-700">
                Hidden Applications
              </h2>
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {hiddenApps.map((app, index) => (
                  <li key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-sm text-zinc-500">PID: {app.pid}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard; 