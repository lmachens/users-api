import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase, getUserCollection } from './utils/database';

if (!process.env.MONGODB_URI) {
  throw new Error('No MONGODB_URI provided');
}

const app = express();
const port = 3000;

// Custom middleware to log requests
app.use((request, _response, next) => {
  console.log('Request received', request.url);
  next();
});

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

const users = [
  {
    name: 'Manuel',
    username: 'manuel123',
    password: '123abc',
  },
  {
    name: 'Leon',
    username: 'lmachens',
    password: 'asdc',
  },
  {
    name: 'Anke',
    username: 'anke9000',
    password: 'ab',
  },
  {
    name: 'Philipp',
    username: 'phgrtz',
    password: 'pw123!',
  },
];

app.get('/api/me', (request, response) => {
  const username = request.cookies.username;
  const foundUser = users.find((user) => user.username === username);
  if (foundUser) {
    response.send(foundUser);
  } else {
    response.status(404).send('User not found');
  }
});

app.post('/api/login', (request, response) => {
  const credentials = request.body;
  const existingUser = users.find(
    (user) =>
      user.username === credentials.username &&
      user.password === credentials.password
  );

  if (existingUser) {
    response.setHeader('Set-Cookie', `username=${existingUser.username}`);
    response.send('Logged in');
  } else {
    response.status(401).send('You shall not pass');
  }
});

app.post('/api/users', async (request, response) => {
  const newUser = request.body;
  if (
    typeof newUser.name !== 'string' ||
    typeof newUser.username !== 'string' ||
    typeof newUser.password !== 'string'
  ) {
    response.status(400).send('Missing properties');
    return;
  }

  const userCollection = getUserCollection();
  const existingUser = await userCollection.findOne({
    username: newUser.username,
  });

  if (!existingUser) {
    const userDocument = await userCollection.insertOne(newUser);
    const responseDocument = { ...newUser, ...userDocument.insertedId };
    response.status(200).send(responseDocument);
  } else {
    response.status(409).send('Username is already taken');
  }
});

app.delete('/api/users/:username', async (request, response) => {
  const username = request.params.username;
  const deletedUser = await getUserCollection().deleteOne({ username });
  if (deletedUser.deletedCount === 0) {
    response.status(404).send("User doesn't exist. Check another Castle 🏰");
    return;
  }

  response.status(200).send('Deleted');
});

app.get('/api/users/:username', async (request, response) => {
  const username = request.params.username;
  const existingUser = await getUserCollection().findOne({ username });
  if (existingUser) {
    response.status(200).send(existingUser);
  } else {
    response.status(404).send('This page is not here. Check another Castle 🏰');
  }
});

app.get('/api/users', async (_request, response) => {
  const userDocuments = await getUserCollection().find().toArray();
  response.status(200).send(userDocuments);
});

app.get('/', (_req, res) => {
  res.send('Hello World 🐱‍👤!');
});

connectDatabase(process.env.MONGODB_URI).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
