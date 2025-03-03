import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPass } from "../../config/firebase";

const Login = () => {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currState, setCurrState] = useState("Sign up");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    if(currState === "Sign up"){
      signup(username, email, password);
    }
    else{
      login(email, password);
    }
  };

  return (
    <div className="login">
      <img src={assets.logo} alt="logo" className="logo" />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currState}</h2>
        { currState === "Sign up" ? <input onChange={(e)=>setUsername(e.target.value)} value={username} type="text" className="form-input" placeholder="Username" required /> : null }
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className="form-input" placeholder="Email" required />
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="form-input" required />
        <button type="submit">{currState === "Sign up" ? "Create account" : "Login"}</button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
            {
                currState === "Sign up"
                ?<p className="login-toggle">Already have an account <span onClick={()=>setCurrState("Login")}>Login here</span></p>
                :<p className="login-toggle">Create an account <span onClick={()=>setCurrState("Sign up")}>click here</span></p>
            }
            {
              currState === "Login" ? <p className="login-toggle">Forgot Password? <span onClick={()=>resetPass(email)}>reset here</span></p> : null
            }
        </div>
      </form>
    </div>
  );
};

export default Login;
