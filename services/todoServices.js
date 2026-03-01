const Todo = require("../models/Todo");
const { redisClient } = require("../config/redis");

const getAllTodos = async (username) => {
  const cacheKey = `todos:${username}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const todos = JSON.parse(cachedData);
      return todos;
    }
  } catch (error) {
    console.error("Redis GET error:", error);
  }

  const todos = await Todo.find({ username }).sort({ createdAt: -1 });

  try {
    await redisClient.set(cacheKey, JSON.stringify(todos), {
      EX: 3600
    });
  } catch (error) {
    console.error("Redis SET error:", error);
  }

  return todos;
};

const createTodo = async (todoName, todoDescription, dueDate, username) => {
  const listCacheKey = `todos:${username}`;
  const todo = await Todo.create({
    username,
    todoName,
    todoDescription,
    dueDate,
  });

  try {
    await redisClient.del(listCacheKey);
  } catch (error) {
    console.error("Redis DEL error:", error);
  }

  return todo;
};

const deleteTodo = async (id, username) => {
  const listCacheKey = `todos:${username}`;
  const itemCacheKey = `todos:${username}:${id}`;
  const result = await Todo.deleteOne({ _id: id, username });
  if (result.deletedCount === 0) throw new Error("Todo not found");

  try {
    await redisClient.del(listCacheKey);
    await redisClient.del(itemCacheKey);
  } catch (error) {
    console.error("Redis DEL error:", error);
  }

  return result.deletedCount;
};

const updateTodo = async ({
  id,
  todoName,
  todoDescription,
  dueDate,
  username,
}) => {
  const listCacheKey = `todos:${username}`;
  const itemCacheKey = `todos:${username}:${id}`;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, username },
    { todoName, todoDescription, dueDate },
    { new: true },
  );
  if (!todo) throw new Error("Todo not found");

  try {
    await redisClient.del(listCacheKey);
    await redisClient.del(itemCacheKey);
  } catch (error) {
    console.error("Redis DEL error:", error);
  }

  return todo;
};

const updateTodoStatus = async (id, username) => {
  const listCacheKey = `todos:${username}`;
  const itemCacheKey = `todos:${username}:${id}`;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, username },
    { isDone: true },
    { new: true },
  );
  if (!todo) throw new Error("Todo not found");

  try {
    await redisClient.del(listCacheKey);
    await redisClient.del(itemCacheKey);
  } catch (error) {
    console.error("Redis DEL error:", error);
  }

  return todo;
};

const deleteAllTodo = async (username) => {
  const listCacheKey = `todos:${username}`;
  const result = await Todo.deleteMany({ username: username });

  try {
    await redisClient.del(listCacheKey);
    const batch = [];

for await (const key of redisClient.scanIterator({
  MATCH: `todos:${username}:*`,
  COUNT: 100
})) {
  batch.push(key);

  if (batch.length === 100) {
    await redisClient.del(batch);
    batch.length = 0;
  }
}

if (batch.length > 0) {
  await redisClient.del(batch);
}
  } catch (error) {
    console.error("Redis keys/DEL error:", error);
  }

  return result.deletedCount;
};

const getTodo = async (id, username) => {
  const cacheKey = `todos:${username}:${id}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Redis GET error:", error);
  }

  const todo = await Todo.findOne({ _id: id, username });
  if (!todo) throw new Error("Todo not found");

  try {
    await redisClient.set(cacheKey, JSON.stringify(todo), {
      EX: 3600
    });
  } catch (error) {
    console.error("Redis SET error:", error);
  }

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
