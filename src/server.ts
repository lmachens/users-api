import express from 'express';

const app = express();
const port = 3000;

const users = ['Manuel', 'Leon', 'Anke', 'Zied'];

app.get('/api/users/:name', (request, response) => {
  const isNameKnow = users.includes(request.params.name);
  if (isNameKnow) {
    response.send(request.params.name);
  }
  // if name is unknown, return 404 with "Name is unknown"
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
