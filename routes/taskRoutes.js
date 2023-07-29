const express = require('express');
const taskData = require('../result.json');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json(taskData);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundTask = taskData.tasks.filter((task) => task.id === id);
  console.log(foundTask);

  if (!foundTask.length) {
    res.status(404).json({ message: 'Invalid ID' });
  }

  res.json(foundTask);
});

router.post('/', (req, res) => {
  const { title, description, completionStatus } = req.body;

  const isCompletionStatusBoolean = typeof completionStatus === 'boolean';

  if (!title || !description || !isCompletionStatusBoolean) {
    res.status(400).json({ message: 'Please fill all the fields' });
  }

  let result = JSON.parse(JSON.stringify(taskData));

  console.log(result);

  count =
    result.tasks.length > 0 ? result.tasks[result.tasks.length - 1].id++ : 1;

  result.tasks.push({
    ...req.body,
    id: count,
  });

  console.log('result after push', result);

  let writePath = path.join(__dirname, '..', 'result.json');

  fs.writeFileSync(writePath, JSON.stringify(result), {
    encoding: 'utf8',
    flag: 'w',
  });

  res.status(201).json({ message: 'Course has been completed successfully' });
});

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundTask = taskData.tasks.filter((task) => task.id === id);
  console.log(foundTask);

  if (!foundTask.length) {
    res.status(404).json({ message: 'Invalid ID' });
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundTask = taskData.tasks.filter((task) => task.id === id);
  console.log(foundTask);

  if (!foundTask.length) {
    res.status(404).json({ message: 'Invalid ID' });
  }

  // const
});

module.exports = router;
