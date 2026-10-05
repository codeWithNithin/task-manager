const express = require('express');
const taskRouter = require('./routes/tasks.route');
const { loadDataSync } = require('./repositories/task.repository');
const app = express();
const port = 3000;

loadDataSync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks",taskRouter)


if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    });
}



module.exports = app;