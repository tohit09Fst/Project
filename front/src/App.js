import React from "react";
import { Routes, Route} from "react-router-dom";
import Signup from "./component/Signup";
import TodoList from "./component/TodoList";
import "./App.css";

export default function App() {
  return (

      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>

  );
}
