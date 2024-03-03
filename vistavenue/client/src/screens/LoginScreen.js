import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
// import { useNavigate } from "react-router-dom";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const history = useNavigate(); if localstorage doesnot work

  async function login() {
    const user = {
      email,
      password,
    };
    console.log(user);

    try {
      setLoading(true);
      const result = await axios.post("/api/user/login", user);
      console.log(result.data);
      alert("logged in");
      setLoading(false);
      localStorage.setItem("currentUser", JSON.stringify(result.data.user));
      window.location.href = "/home";

      console.log("Login successful.");
    } catch (error) {
      console.log(error);
      alert("login failed");
      setLoading(false);
      setError(true);
    }
    console.log(user);
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error && <Error message={"Invalid Credentials"} />}
          <div className="bs">
            <h2>Login</h2>

            <input
              type="text"
              margin="normal"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              margin="normal"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary my-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
