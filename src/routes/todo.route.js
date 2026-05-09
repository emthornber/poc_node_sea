const express = require("express");
const router = express.Router();

const todoController = require('../controllers/todo.controller');

router.get('/:hash', async (req, res) => {
  try {
    const {
      hash
    } = req.params;

    const todo = await todoController.readtodo(hash);
    res.json({
      todo,
      status: 200,
      message: 'todo read successfully!'
    });
  } catch (err) {
    res.json({
      todo: null,
      status: err.code || err.statusCode || 500,
      message: err.message || 'Something went wrong while reading todo from DB!'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      rating,
      price,
      hash
    } = req.body;

    const todo = await todoController.createtodo({
      name,
      rating,
      price,
      hash
    });

    res.json({
      todo,
      status: 200,
      message: 'todo created successfully!'
    })
  } catch (err) {
    res.json({
      todo: null,
      status: err.code || err.statusCode || 500,
      message: err.message || 'Something went wrong while creating new todo!'
    });
  }
});

router.put('/', async (req, res) => {
  try {
    const {
      hash
    } = req.body;

    const todo = await todoController.updatetodoHash(hash);
    res.json({
      todo,
      status: 200,
      message: 'todo updated successfully!'
    });
  } catch (err) {
    res.json({
      todo: null,
      status: err.code || err.statusCode || 500,
      message: err.message || 'Something went wrong while updating todo hash!'
    });
  }
});

module.exports = router;