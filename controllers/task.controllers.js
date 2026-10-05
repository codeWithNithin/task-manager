const { getTasks, saveTasks } = require("../repositories/task.repository");


const createTask = async (req, res) => {
const data = getTasks();

const {title, description, completed} = req.body

const newPost = {
    id: data.length + 1,
    title,
    description,
    completed
}

data.push(newPost)

await saveTasks(data)

res.status(201).json(newPost)
}


const getAllTasks =  (req, res) => {
    const data = getTasks()

    res.status(200).json(data)
}

const getTaskById = (req, res) => {

const postId = parseInt(req.params.id);

 const data = getTasks()

 const foundTask = data.find((ele) => ele.id === postId)

if(!foundTask) {
  return  res.status(404).json({message: "invalid task id" })
}

res.status(200).json(foundTask)
}

const updateTask = async (req, res) => {
    const postId = Number(req.params.id);

    const data = getTasks();

    const { title, description, completed } = req.body;

    const foundTask = data.find((task) => task.id === postId);

    if (!foundTask) {
        return res.status(404).json({
            message: "invalid task id"
        });
    }

    foundTask.title = title;
    foundTask.description = description;
    foundTask.completed = completed;

    await saveTasks(data);

    res.status(200).json({
        message: "task edited successfully",
        task: foundTask
    });
}

const deleteTask = async (req, res) => {
    const postId = Number(req.params.id);

    const tasks = getTasks();

    const foundTask = tasks.find((task) => task.id === postId);

    if (!foundTask) {
        return res.status(404).json({
            message: "invalid task id"
        });
    }

    const updatedTasks = tasks.filter(
        (task) => task.id !== postId
    );

    await saveTasks(updatedTasks);

    res.status(200).json({
        message: "Task deleted successfully"
    });

}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
}