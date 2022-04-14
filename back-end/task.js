import express from 'express'
import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  completionDate: Date,
})

export const Task = mongoose.model('Task', taskSchema)

export const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
    return res.send(tasks)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

