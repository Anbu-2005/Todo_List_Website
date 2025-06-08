function taskReducer(tasks, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [...tasks, action.task];

    case 'SET_TASK':
      return action.payload;

    case 'REMOVE_TASK':
      return tasks.filter((task) => task._id !== action.id);

    case 'MARK_DONE':
      // Replace task with updated task from backend
      return tasks.map((task) =>
        task._id === action.task._id ? action.task : task
      );
       case 'UPDATE_DUE_TASK':
      // Similar update for due task
      return tasks.map((task) =>
        task._id === action.task._id ? action.task : task
      );

    default:
      throw new Error('Unknown Action ' + action.type);
  }
}

export default taskReducer;
