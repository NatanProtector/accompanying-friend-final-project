import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MyMap from "./components/MapScreen";
import Home from "./components/Home";
import BasicScreen from "./components/BasicScreen";
import Header from "./components/Header";
import ManageUsers from "./components/ManageUsers";
import ManageAreaMap from "./components/ManageAreaMap";

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
            <Route path="/Manage/AreaMap" element={<ManageAreaMap />} />
          </Routes>
        }
      />
    </Router>
  );
};

export default App;
