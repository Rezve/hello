import React from 'react';
import GeneratorFunction from '../components/GeneratorFunction';
import BatchConfig from '../components/BatchConfig';
import DBConfig from '../components/DBConfig';
import LiveLog from '../components/LiveLog';

const HomePage: React.FC = () => {

  return (
    <div className="fake-data-generator">
      <DBConfig />
      <GeneratorFunction />
      <BatchConfig />
      <LiveLog />
      
    </div>
  );
};

export default HomePage;