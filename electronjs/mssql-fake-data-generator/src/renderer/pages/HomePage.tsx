import React, { useState } from 'react';
import GeneratorFunction from '../components/GeneratorFunction';
import BatchConfig from '../components/BatchConfig';
import DBConfig from '../components/DBConfig';
import LiveLog from '../components/LiveLog';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const HomePage: React.FC = () => {

  const [isConnected, setIsConnected] = useState(false);
  const [isCodeConfirmed, setCodeConfirmed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="flex h-full">
       <PanelGroup direction="horizontal" autoSaveId="FeedMyDB-Sidebar">

      {/* Left Sidebar */}
      <Panel defaultSize={18} collapsedSize={5} minSize={5}>
      <div className="w-80 flex flex-col bg-gray-100 p-4 space-y-4 overflow-y-auto">
        <DBConfig 
          isConnected={isConnected}
          setIsConnected={setIsConnected}
        />
        <BatchConfig isConnected={isConnected}
        isRunning={isRunning}
        isCodeConfirmed={isCodeConfirmed}
        setIsRunning={setIsRunning} />
      </div>
      </Panel>

      <PanelResizeHandle className='border border-gray-300'/>

      <Panel>
        <PanelGroup autoSaveId="FeedMyDB-Editor" direction="vertical">

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
          <Panel>
            <div className="flex-1 p-4">
              <GeneratorFunction 
              isConnected={isConnected}
              isCodeConfirmed={isCodeConfirmed}
              setCodeConfirmed={setCodeConfirmed} />
            </div>
          </Panel>

          <PanelResizeHandle className='border border-gray-300'/>

            {/* Bottom Docked Logs */}
            <Panel minSize={5}>
            <div className="h-1/3 bg-gray-100 p-4">
              <LiveLog />
            </div>
            </Panel>
          </div>

        </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default HomePage;