const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const req = require('express/lib/request');

const app = express();

app.use(cors());
app.use(express.json());


const users = [];

function checksExistsUserAccount(req, res, next) {
  // Complete aqui
  const { username } = req.headers;
   
  const user = users.find((user) => user.username === username);

  if(!user){
    return res.status(404).json({error: "User not found!"});
  }
  
  req.user = user;

  return next();
}

app.post('/users', (req, res) => {
  // Complete aqui
  const { name, username } = req.body;

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
   
  const UserExists = users.some((user) => user.username === username);
  
  if (UserExists) {
    return res.status(400).json({
      error: "User Already Exists"
    })
  }

  users.push(user);

   return res.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;

  return res.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { title,deadline } = req.body;
  const { user } = req;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }


  user.todos.push(todo);

  return res.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;
  const { title, deadline } = req.body;

  const todo = user.todos.find((task) => task.id === id);

  if(!todo){
    return res.status(404).json({error: "Task not found"})
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return res.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { user } = req;
  const { id } = req.params;
  
  const todo = user.todos.find((task) => task.id === id);

  if(todo){
    todo.done = true

    return res.json(todo);
  }

  res.status(404).json({error: "Task incomplete"})
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
  const { id } = req.params;
  const { user } = req;

  const todo = user.todos.find((task) => task.id === id);

  if(!todo){
    res.status(404).json({error: "Id is not found"});
  }

  user.todos.splice(todo);

  return res.status(204).json();

});

module.exports = app;