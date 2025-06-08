import React, { useContext, useState } from 'react';
import moment from 'moment';
import './task.css';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from '../../Axios/axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

function Task({ task }) {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);

  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate ? moment(task.dueDate).format("YYYY-MM-DD") : "",
  });

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/task/removeTask/${task._id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      dispatch({ type: 'REMOVE_TASK', id: task._id });
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleMarkDone = async () => {
    try {
      const updatedTask = await axios.put(
        `/task/updateTask/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      dispatch({ type: 'MARK_DONE', task: updatedTask.data });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleEditChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTask = await axios.put(
        `/task/updateTask/${task._id}`,
        editedTask,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      dispatch({ type: 'MARK_DONE', task: updatedTask.data });
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  return (
    <div className="bg-slate-300 py-4 px-4 rounded-lg shadow-md flex items-start justify-between gap-4 mb-3">
      <div className="pt-2">
        <input
          type="checkbox"
          className="w-5 h-5"
          onChange={handleMarkDone}
          checked={task.completed}
        />
      </div>

      <div className="task-info text-slate-900 text-sm flex-grow">
        {editMode ? (
          <div className="edit-form bg-white p-3 rounded-md shadow-lg border border-gray-300 flex flex-col gap-3">
            <div className="flex flex-col">
              <label htmlFor="title" className="text-xs font-semibold text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleEditChange}
                id="title"
                className="p-2 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task title"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="text-xs font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleEditChange}
                id="description"
                rows="3"
                className="p-2 rounded-md border border-gray-400 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task description"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="dueDate" className="text-xs font-semibold text-gray-700">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={editedTask.dueDate}
                onChange={handleEditChange}
                id="dueDate"
                className="p-2 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        ) : (
          <>
            <h4 className="task-title text-lg capitalize font-semibold">{task.title}</h4>
            <p className="task-description text-sm text-gray-800 mb-1">{task.description}</p>
            {task.dueDate && (
              <p
                className="text-sm font-semibold"
                style={{
                  color: moment(task.dueDate).isBefore(moment(), 'day') ? 'red' : 'black',
                }}
              >
                Due: {moment(task.dueDate).format('MMM DD, YYYY')}
              </p>
            )}
            <div className="italic opacity-60 text-xs">
              {task?.createdAt ? moment(task.createdAt).fromNow() : 'just now'}
            </div>
          </>
        )}
      </div>

      <div className="action-btns text-sm text-white flex flex-col items-center gap-3 pt-2">
        {editMode ? (
          <SaveIcon
            style={{ fontSize: 28, cursor: 'pointer', color: 'green' }}
            onClick={handleSaveEdit}
          />
        ) : (
          <EditIcon
            style={{ fontSize: 28, cursor: 'pointer', color: '#1f2937' }}
            onClick={() => setEditMode(true)}
          />
        )}
        <DeleteIcon
          style={{ fontSize: 30, cursor: 'pointer' }}
          onClick={handleRemove}
          className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1"
        />
      </div>
    </div>
  );
}

export default Task;
