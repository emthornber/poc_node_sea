const todo = require('../models/todo.model');
const {
  nanoid
} = require('nanoid');

exports.createtodo = async function (todoObj) {
  try {
    if (!todoObj || !todoObj.name || !todoObj.rating || !todoObj.price || !todoObj.hash) {
      throw new Error('Invalid arguments');
    }
    const {
      name,
      rating,
      price,
      hash
    } = todoObj;

    let todo = new todo({
      name,
      rating,
      price,
      hash
    });

    return await todo.save();
  } catch (err) {
    return Promise.reject(err);
  }
}

exports.updatetodoHash = async function (hash) {
  try {
    if (!hash) {
      throw new Error('Incomplete arguments');
    }

    let todo = await todo.findOne({
      hash
    });
    todo.hash = getUniqueHash(todo);

    return await todo.save();
  } catch (err) {
    return Promise.reject(err);
  }
}

exports.readtodo = async function (hash) {
  try {
    if (!hash) {
      throw new Error('Invalid todo id');
    }

    return await todo.findOne({
      hash
    });
  } catch (err) {
    return Promise.reject(err);
  }
}


// Private function
function getUniqueHash(todo) {
  if (!todo) return null;
  const currentHash = todo.hash;
  let newHash = nanoid(10);

  while (newHash === currentHash) {
    newHash = nanoid(10);
  }
  return newHash;
}