// src/components/CreateTask/CreateTask.jsx
import React, { useState, useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from "../../Axios/axios.js";
import "./createTask.css";

function CreateTask() {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/task/addTask",
        { title, description, dueDate },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      dispatch({
        type: "ADD_TASK",
        task: res.data, // full task from backend
      });

      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <div className="addContainer md:w-1/3 md:mx-auto mx-3 mt-3 flex justify-center">
      <div className="w-11/12">
        <form onSubmit={handleAdd}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="my-3">
            <label htmlFor="description">Description</label>
            <textarea
              rows={5}
              name="description"
              id="description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "none" }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="my-3">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={dueDate}
              required
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-700 rounded-md text-white px-5 py-1"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
