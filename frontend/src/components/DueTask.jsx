import React, { useContext } from 'react';
import Task from './Task/Task';
import TaskContext from '../context/TaskContext';

function DueTasks() {
  const { tasks } = useContext(TaskContext);

  // Filter tasks: not completed and have a valid dueDate
  const dueTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      !isNaN(new Date(task.dueDate).getTime())
  );

  return (
    <div>
      {dueTasks.length !== 0 ? (
        dueTasks.map((task, index) => (
          <Task key={index} task={task} id={index} />
        ))
      ) : (
        <h1>No Due Task Found</h1>
      )}
    </div>
  );
}

export default DueTasks;
