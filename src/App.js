import React from 'react';
import './App.css';
import 'monday-ui-react-core/dist/main.css';
import FeatureManager from './components/FeatureManager';
import { mondayUserInstance } from './api/monday';

const App = () => {
  return (
    <div className="App">
      <FeatureManager mondayUserInstance={mondayUserInstance} />
    </div>
  );
};

export default App;
