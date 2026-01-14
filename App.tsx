import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import { ViewState } from './types';

function App() {
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.PLANNER:
        return <Planner />;
      case ViewState.FLASHCARDS:
        return <Flashcards />;
      case ViewState.QUIZ:
        return <Quiz />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderContent()}
    </Layout>
  );
}

export default App;
