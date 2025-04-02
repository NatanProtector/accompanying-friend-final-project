import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MyMap from './components/MyMap';
import Home from './components/Home';
import BasicScreen from './components/BasicScreen';
import Header from './components/Header';
import ManageUsers from './components/ManageUsers';

const App = () => {
  return (
    <Router>
      <BasicScreen
        header={<Header />}
        content={
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Manage/Users" element={<ManageUsers />} />
            <Route path="/map" element={<MyMap />} />
          </Routes>
        }
      />
    </Router>
  );
};

export default App;