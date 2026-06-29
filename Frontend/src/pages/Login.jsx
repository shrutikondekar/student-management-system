import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();   // <-- HERE

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      console.log("LOGIN RESPONSE =", response.data);

      toast.success("Login successful!");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      console.log("TOKEN =", localStorage.getItem("token"));
      console.log("ROLE =", localStorage.getItem("role"));

      navigate("/dashboard");  // <-- USE HERE

    } catch (error) {
      console.log(error);
      alert("Login failed");
      toast.error("Invalid username or password!");
    }
  };

  return (
    <div style={{ margin: "100px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}