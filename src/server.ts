import express from 'express';

const app = express();
const port = 3000;

app.get('/api/users/:name', (_request, response) => {
  response.send('Leon');
});

app.get('/api/users', (_request, response) => {
  const users = ['Manuel', 'Leon', 'Anke'];
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World 🐱‍👤!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
