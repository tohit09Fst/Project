import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Task to be added:", task); 
    try {
      await axios.post("http://localhost:5000/todos", { task });
      setTask(""); 
      fetchTodos(); 
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      fetchTodos(); 
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdate = async (id, updatedTask) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, { task: updatedTask });
      fetchTodos(); 
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="container">
      <h2>Todo List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
    <button type="submit">Add Task</button>


      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="text"
              value={todo.task}
              onChange={(e) => handleUpdate(todo._id, e.target.value)}
            />
            <button onClick={() => handleDelete(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
