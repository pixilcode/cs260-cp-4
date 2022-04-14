// GET /api/stories
// GET /api/currWeek
// GET /api/weekGoals

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import { router as storyRouter } from './story.js'
import { router as taskRouter } from './task.js'
import { router as goalRouter } from './goal.js'

mongoose.connect('mongodb://127.0.0.1:27017/tasks', {
  useNewUrlParser: true,
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use('/api/stories', storyRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/goals', goalRouter)

function getStartOfWeek(date) {
  const startOfWeek = new Date();
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

function getWeek(date) {
  const sunday = getStartOfWeek(date);
  const saturday = getStartOfWeek(date);

  saturday.setDate(sunday.getDate() + 6);

  return {
    startDay: sunday,
    endDay: saturday,
  }
}

app.get('/api/currWeek', async (req, res) => {
  const today = new Date()
  return res.send(getWeek(today))
})

app.listen(3002, () => console.log('Server listening on port 3002!'))
