import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function Signup() {
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", value);
      console.log(response.data);
      setValue({
        name: "",
        email: "",
        password: "",
      });
      alert("Account created");
      navigate("/todos"); // Redirect to todo list page
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error
    }
  };

  return (
    <>
      <div className="container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="name"
            onChange={handleChange}
            value={value.name}
            name="name"
          ></input>
          <input
            placeholder="email"
            onChange={handleChange}
            value={value.email}
            name="email"
          ></input>
          <input
            placeholder="password"
            value={value.password}
            onChange={handleChange}
            name="password"
          ></input>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
}
