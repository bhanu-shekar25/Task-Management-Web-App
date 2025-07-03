import React from 'react';
import Header from '../components/Header.jsx';
import TaskBoard from '../components/TaskBoard.jsx';
import Filters from '../components/Filters.jsx';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="filters-section">
            <Filters />
          </div>
          <div className="task-board-section">
            <TaskBoard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;