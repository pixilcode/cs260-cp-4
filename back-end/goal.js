import express from 'express'
import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema({
  weekStart: Date,
  goal: Number,
})

export const Goal = mongoose.model('Goal', goalSchema)

export const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find()
    return res.send(goals)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.post('/', async (req, res) => {
  try {
    const { goal, weekStart } = req.body

    const newGoal = new Goal({
      goal,
      weekStart: new Date(weekStart),
    })
    
    await newGoal.save()
    return res.send(newGoal)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
    goal.goal = req.body.goal
    await goal.save()

    return res.send(goal)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})
