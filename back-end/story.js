import express from 'express'
import mongoose from 'mongoose'

import { Task } from './task.js'

const storySchema = new mongoose.Schema({
  title: String,
  description: {
    role: String,
    goal: String,
    purpose: String,
  },
  status: String,
  completionDate: Date,
  points: Number,
  tasks: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
  }],
})

export const Story = mongoose.model('Story', storySchema)

export const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().populate('tasks')
    return res.send(stories)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.post('/', async (req, res) => {
  try {
    const story = new Story({
      title: '',
      description: {
        role: "",
        goal: "",
        purpose: "",
      },
      status: "Ready",
      completionDate: null,
      points: 1,
      tasks: [],
    })

    await story.save()

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.post('/:storyId/addTask', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      completed: false,
      completionDate: null,
    })

    await newTask.save()

    const story = await Story.findById(req.params.storyId)
    story.tasks.push(newTask)

    await story.save()

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.put('/:storyId', async (req, res) => {
  try {
    const { title, description, points } = req.body
    const story = await Story.findById(req.params.storyId)
    
    story.title = title
    story.description = description
    story.points = points

    await story.save()

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.put('/:storyId/plan', async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId)
    
    story.status = 'In Progress'

    await story.save()

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.put('/:storyId/unplan', async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId)
    
    story.status = 'Ready'

    await story.save()

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.put('/:storyId/checkTask/:taskId', async (req, res) => {
  try {
    // Check off the task
    const task = await Task.findById(req.params.taskId)
    task.completed = true
    task.completionDate = new Date()

    await task.save()

    // Update the story status
    const story = await Story.findById(req.params.storyId).populate('tasks')

    if(
      story.tasks.length > 0 &&
      story.tasks.every((task) => task.completed) &&
      story.status !== "Completed"
    ) {
      story.status = "Completed"
      story.completionDate = new Date()

      await story.save()
    }

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.put('/:storyId/uncheckTask/:taskId', async (req, res) => {
  try {
    // Check off the task
    const task = await Task.findById(req.params.taskId)
    task.completed = false
    task.completionDate = null

    await task.save()

    // Update the story status
    const story = await Story.findById(req.params.storyId).populate('tasks')

    if(
      story.status === "Completed" && (
      story.tasks.length === 0 ||
      !story.tasks.every((task) => task.completed)
    )) {
      story.status = "In Progress"
      story.completionDate = null

      await story.save()
    }

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.delete('/:storyId/deleteTask/:taskId', async (req, res) => {
  try {
    // Remove the task from the story
    const story = await Story.findById(req.params.storyId).populate('tasks')
    const taskIndex = story.tasks.find((task) => task._id === req.params.taskId)

    story.tasks.splice(taskIndex, 1)
    await story.save()

    // Update the story status
    if(
      story.tasks.length > 0 &&
      story.tasks.every((task) => task.completed) &&
      story.status !== "Completed"
    ) {
      story.status = "Completed"
      story.completionDate = new Date()

      await story.save()
    }

    // Delete the task
    await Task.deleteOne({ _id: req.params.taskId })

    return res.send(story)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.delete('/:storyId', async (req, res) => {
  try {
    // Delete the story
    await Story.deleteOne({ _id: req.params.storyId })

    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})
