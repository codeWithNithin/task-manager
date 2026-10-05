const express = require("express");
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require("../controllers/task.controllers");
const validateIncomingRequest = require("../validators/incomingRequest.validator");

const taskRouter = express.Router();


taskRouter.post("/", validateIncomingRequest, createTask)

taskRouter.get("/", getAllTasks)

taskRouter.get("/:id",getTaskById)

taskRouter.put("/:id", validateIncomingRequest , updateTask)

taskRouter.delete("/:id", deleteTask)


module.exports = taskRouter
