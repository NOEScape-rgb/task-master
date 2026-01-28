const Todo = require("../models/Todo");

const getAllTodos = async (username) => {
  const todos = await Todo.find({ username }).sort({ createdAt: -1 });
  return todos;
};

const createTodo = async (todoName, todoDescription, dueDate, username) => {
  const todo = await Todo.create({
    username,
    todoName,
    todoDescription,
    dueDate,
  });

    return todo;
};

const deleteTodo = async (id, username) => {
  const result = await Todo.deleteOne({ _id: id, username });
  if (result.deletedCount === 0) throw new Error("Todo not found");
  return result.deletedCount;
};

const updateTodo = async ({
  id,
  todoName,
  todoDescription,
  dueDate,
  username,
}) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: id, username },
    { todoName, todoDescription, dueDate },
    { new: true },
  );
  if (!todo) throw new Error("Todo not found");
  return todo;
};

const updateTodoStatus = async (id, username) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: id, username },
    { isDone: true },
    { new: true },
  );
  if (!todo) throw new Error("Todo not found");
  return todo;
};

const deleteAllTodo = async (username) => {
  // Delete all todos where username matches
  const result = await Todo.deleteMany({ username: username });
  return result.deletedCount;
};

const getTodo = async (id, username) => {
  const todo = await Todo.findOne({ _id: id, username });
  if (!todo) throw new Error("Todo not found");
  return todo;
};

module.exports = {
  createTodo,
  deleteTodo,
  deleteAllTodo,
  updateTodo,
  updateTodoStatus,
  getAllTodos,
  getTodo,
};
