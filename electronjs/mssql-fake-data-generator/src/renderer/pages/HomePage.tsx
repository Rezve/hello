import React, { useState } from 'react';
import GeneratorFunction from '../components/GeneratorFunction';
import BatchConfig from '../components/BatchConfig';
import DBConfig from '../components/DBConfig';
import LiveLog from '../components/LiveLog';
import { Resizable } from 'react-resizable';
import { BasicCode } from '../utils/sample-code';

const HomePage: React.FC = () => {

  const [isConnected, setIsConnected] = useState(false);
  const [isCodeConfirmed, setCodeConfirmed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logHeight, setLogHeight] = useState(200);

  const debounce = (fn: any, ms: any) => {
    let timeout: any;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), ms);
    };
  };
  
  const onResize = debounce((event: any, { size }: any) => {
    setLogHeight(size.height);
  }, 10);

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-80 flex flex-col bg-gray-100 border-r border-gray-300 p-4 space-y-4 overflow-y-auto">
        <DBConfig 
          isConnected={isConnected}
          setIsConnected={setIsConnected}
        />
        <BatchConfig isConnected={isConnected}
        isRunning={isRunning}
        isCodeConfirmed={isCodeConfirmed}
        setIsRunning={setIsRunning} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <GeneratorFunction 
          isConnected={isConnected}
          isCodeConfirmed={isCodeConfirmed}
          setCodeConfirmed={setCodeConfirmed} />
        </div>

        {/* Bottom Docked Logs */}
        <div className="h-1/3 bg-gray-100 border-t border-gray-300 p-4">
          <LiveLog />
        </div>
        {/* <Resizable
          height={logHeight}
          width={Infinity} // Full width of the container
          onResize={onResize}
          minConstraints={[0, 400]} // Minimum height: 100px
          maxConstraints={[0, window.innerHeight * 0.5]} // Maximum height: 50% of window
          handle={<div className="h-1 bg-gray-400 cursor-ns-resize" />} // Resize handle
          //  "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
          resizeHandles={['w']} // Only resize from the top (north)
        >
          <div
            className="bg-gray-100 border-t border-gray-300 p-4 overflow-y-auto"
            style={{ height: `${logHeight}px` }} // Apply dynamic height
          >
            <LiveLog />
          </div>
        </Resizable> */}
      </div>
    </div>
  );
};

export default HomePage;