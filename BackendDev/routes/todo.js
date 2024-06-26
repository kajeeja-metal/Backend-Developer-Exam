const express = require('express');
const router = express.Router();

let todos = [];
let currentId = 1;

// Middleware for validation
const validateTodo = (req, res, next) => {
  const { task, display_order } = req.body;
  if (typeof task !== 'string' || task.trim() === '') {
    return res.status(400).send('Invalid task');
  }
  if (display_order !== undefined && typeof display_order !== 'number') {
    return res.status(400).send('Invalid display_order');
  }
  next();
};

const sorted_display_orders = (todos) => {
  return todos.slice().sort((a, b) => a.display_order - b.display_order);
}
// Get all todos
router.get('/', (req, res) => {
  const sortedTodos = sorted_display_orders(todos)
  res.json({
    status : true,
    data: sortedTodos
  });
});

// Get a single todo by id
router.get('/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');
  res.json({
    status : true,
    data: todo
  });
});

// Create a new todo
router.post('/', validateTodo, (req, res) => {
  const newTodo = {
    id: currentId++,
    task: req.body.task,
    display_order: req.body.display_order !== undefined ? req.body.display_order : todos.length + 1,
    completed: false
  };
  todos.push(newTodo);
  const sortedTodos = sorted_display_orders(todos)
  res.json({
    status : true,
    message : "Create task success",
    data: sortedTodos
  });
});

// Update a todo
router.put('/:id', validateTodo, (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');

  todo.task = req.body.task !== undefined ? req.body.task : todo.task;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  todo.display_order = req.body.display_order !== undefined ? req.body.display_order : todo.display_order;
  const sortedTodos = sorted_display_orders(todos)
  res.json({
    status : true,
    message : "Update task success",
    data: sortedTodos
  });
});

// Delete a todo
router.delete('/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Todo not found');
  todos.splice(index, 1);
  res.json({
    status : true,
    message : "Delete task success",
  });
});

module.exports = router;
