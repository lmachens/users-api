import express from 'express';

const app = express();
const port = 3000;

// For parsing application/json
app.use(express.json());

const users = ['Manuel', 'Leon', 'Anke', 'Zied'];

app.post('/api/users', (request, response) => {
  response.send(request.body.name);
});

app.delete('/api/users/:name', (request, response) => {
  const usersIndex = users.indexOf(request.params.name);
  if (usersIndex === -1) {
    response.status(404).send("User doesn't exist. Check another Castle 🏰");
    return;
  }

  users.splice(usersIndex, 1);
  response.send('Deleted');
});

app.get('/api/users/:name', (request, response) => {
  const isNameKnow = users.includes(request.params.name);
  if (isNameKnow) {
    response.send(request.params.name);
  } else {
    response.status(404).send('This page is not here. Check another Castle 🏰');
  }
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World 🐱‍👤!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
