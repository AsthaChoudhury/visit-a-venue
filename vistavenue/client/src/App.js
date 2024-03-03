import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import RegisterScreen from "./screens/RegisterScreen";
// import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/profileScreen";
import adminScreen from "./screens/adminScreen";
function App() {
  // const [room, setRoom] = useState();

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/home" element={<Homescreen />} />
          <Route
            path="/book/:roomid/:fromdate/:todate"
            element={<Bookingscreen />}
          />

          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/admin" element={adminScreen} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
