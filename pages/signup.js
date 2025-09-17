import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a confirmation link!");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Logged in successfully!");
      window.location.href = "/dashboard";
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Sign Up or Log In</h1>
      <form
        style={{
          display: "inline-block",
          textAlign: "left",
          marginTop: "20px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "8px", width: "250px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "8px", width: "250px" }}
          />
        </div>
        <button onClick={handleSignup} style={{ marginRight: "10px" }}>
          Sign Up
        </button>
        <button onClick={handleLogin}>Log In</button>
      </form>
      {message && <p style={{ marginTop: "20px", color: "red" }}>{message}</p>}
    </div>
  );
}
