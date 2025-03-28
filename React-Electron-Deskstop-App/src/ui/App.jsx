import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MyMap from './components/MyMap';

const Home = () => <h2>Home Page</h2>;

const ManageUsers = () => <h2>Manage Users Page</h2>;

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Manage/Users">Manage Users</Link>
            </li>
            <li>
              <Link to="/map">Map</Link>
            </li>
          </ul>
        </nav>

        {/* Define routes for different components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Manage/Users" element={<ManageUsers />} />
          <Route path="/map" element={<MyMap />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
