const express = require("express");
const router = express.Router();
const { getAllTodoController,
    createTodoController,
    deleteTodoController,
    deleteAllTodoController,
    updateTodoController,
    getTodoController, updateTodoStatusController
} = require("../controllers/todoControllers");

router.post("/", createTodoController);
router.delete("/:id", deleteTodoController);
router.delete("/", deleteAllTodoController);
router.patch("/:id", updateTodoController);
router.patch("/:id/status", updateTodoStatusController);
router.get("/:id", getTodoController);
router.get("/", getAllTodoController);

module.exports = router;
