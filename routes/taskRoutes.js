const express = require('express');
const fs = require('fs');
const router = express.Router();

const taskData = JSON.parse(fs.readFileSync(`${__dirname}/../result.json`));

router.get('/', (req, res) => {
  res.status(200).json(taskData);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundTask = taskData.find((task) => task.id === id);
  console.log(foundTask);

  if (!foundTask) {
    res.status(404).json({ message: 'Invalid ID' });
  }

  res.json({ data: { foundTask } });
});

router.post('/', (req, res) => {
  const { title, description, completionStatus } = req.body;

  const isCompletionStatusBoolean = typeof completionStatus === 'boolean';

  if (!title || !description || !isCompletionStatusBoolean) {
    res.status(400).json({ message: 'Please fill all the fields' });
  }

  const newId = taskData.length + 1;
  const newTask = Object.assign(
    { id: newId },
    { title, description, completionStatus }
  );

  taskData.push(newTask);

  fs.writeFileSync(`${__dirname}/../result.json`, JSON.stringify(taskData), {
    encoding: 'utf8',
    flag: 'w',
  });

  res.status(201).json({ message: 'Task has been added  successfully' });
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundTask = taskData.find((task) => task.id === id);

  if (!foundTask) {
    res.status(404).json({ message: 'Invalid ID' });
  }

  const { title, description, completionStatus } = req.body;

  const index = taskData.findIndex((task) => task.id === id);

  taskData[index].title = title;
  taskData[index].description = description;
  taskData[index].completionStatus = completionStatus;

  fs.writeFileSync(`${__dirname}/../result.json`, JSON.stringify(taskData), {
    encoding: 'utf8',
    flag: 'w',
  });

  const updatedTask = taskData.find((task) => task.id === id);

  res.status(200).json({ data: { updatedTask } });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundTask = taskData.find((task) => task.id === id);

  if (!foundTask) {
    res.status(404).json({ message: 'Invalid ID' });
  }

  const index = taskData.findIndex((task) => task.id === id);

  taskData.splice(index, 1);

  fs.writeFileSync(`${__dirname}/../result.json`, JSON.stringify(taskData), {
    encoding: 'utf8',
    flag: 'w',
  });

  res.status(200).json({ message: 'Task deleted successfully' });
});

module.exports = router;
