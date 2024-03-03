import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [sucess, setsuccess] = useState();

  async function register() {
    if (password === confirm) {
      const user = {
        name,
        email,
        password,
        confirm,
      };
      try {
        setloading(true);
        const result = await axios.post("/api/user/register", user);
        console.log(result.data);
        alert("registered");
        setloading(false);
        setsuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
      } catch (error) {
        console.log(error);
        alert("registration failed");
        setloading(false);
        seterror(true);
      }
      console.log(user);
    } else {
      alert("Passwords do not match");
    }
  }

  return (
    <div>
      {loading && <Loader />}
      {error && <Error />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {sucess && <Success message="Registration success" />}
          <div className="bs">
            <h2>Register</h2>

            <input
              type="text"
              margin="normal"
              className="form-control"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              margin="normal"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="text"
              margin="normal"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type="text"
              margin="normal"
              className="form-control"
              placeholder="confirm password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
              }}
            />
            <button className="btn btn-primary my-3" onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
