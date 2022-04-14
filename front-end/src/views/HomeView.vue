<template>
  <div class="home">
    <h1>Home</h1>
    <main>
      <section id="goals">
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Tasks</th>
              <th>Stories</th>
              <th>Total</th>
              <th>Goal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in weeks" :key="week.startDate.valueOf()">
              <td>
                {{ week.startDate.toDateString() }}—{{
                  week.endDay.toDateString()
                }}
              </td>
              <td>{{ week.taskSum }}</td>
              <td>{{ week.storySum }}</td>
              <td>{{ week.totalSum }}</td>
              <td v-if="week.goal">{{ week.goal }}</td>
              <td v-else>Unset</td>
            </tr>
          </tbody>
        </table>
        <p id="currGoal">
          Current week goal:
          <input type="number" v-if="editGoal" v-model="setGoal" min="0" />
          <span v-else>{{ currGoal }}</span>
          <span v-if="editGoal" class="change" @click="toggleEdit">(Done)</span>
          <span v-else class="change" @click="toggleEdit">(Edit)</span>
        </p>
      </section>

      <section id="tasks">
        <h2>Tasks</h2>
        <section
          v-for="story in currStories"
          :key="story.id"
          class="story"
          :id="`story${story._id}`"
        >
          <h3>{{ story.title }}: {{ story.points }} points</h3>
          <div v-for="task in story.tasks" :key="task._id" class="task">
            <input
              type="checkbox"
              v-model="task.completed"
              :id="`task${task._id}`"
              :name="`task${task._id}`"
              @input="updateStory(story._id, task._id)"
            />
            <label for="task${task._id}">{{ task.title }}</label>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";

function getStartOfWeek(date) {
  const startOfWeek = new Date();
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

export default {
  name: "HomeView",

  data() {
    return {
      stories: [],
      currStories: [],
      currWeek: {
        startDay: new Date(),
        endDay: new Date(),
      },
      weekGoals: [],
      editGoal: false,
      setGoal: null,
    };
  },

  async created() {
    this.update();
  },

  methods: {
    toggleEdit() {
      this.editGoal = !this.editGoal;
    },

    async updateStory(storyId, taskId) {
      const story = this.stories.find((story) => story._id === storyId);
      const task = story.tasks.find((task) => task._id === taskId);

      task.completed = !task.completed;

      if (task.completed && task.completionDate === null) {
        await axios.put(`/api/stories/${story._id}/checkTask/${task._id}`);
      } else if (!task.completed && task.completionDate !== null) {
        await axios.put(`/api/stories/${story._id}/uncheckTask/${task._id}`);
      }

      this.update();
    },

    async update() {
      const [stories, currWeek, weekGoals] = await Promise.all([
        axios.get("/api/stories"),
        axios.get("/api/currWeek"),
        axios.get("/api/goals"),
      ]);

      this.currWeek = {
        startDay: new Date(currWeek.data.startDay),
        endDay: new Date(currWeek.data.endDay),
      };

      this.stories = stories.data.map((story) => ({
        ...story,
        completionDate: new Date(story.completionDate),
      }));

      this.currStories = this.stories.filter(
        (story) =>
          story.status === "In Progress" ||
          (story.status === "Completed" &&
            story.completionDate.getTime() > this.currWeek.startDay.getTime() &&
            story.completionDate.getTime() <= this.currWeek.endDay.getTime())
      );

      this.weekGoals = weekGoals.data.map((goal) => ({
        ...goal,
        weekStart: new Date(goal.weekStart),
      }));
    },
  },

  watch: {
    async setGoal(goal) {
      const currGoal = this.weekGoals.find(
        (weekGoal) =>
          weekGoal.weekStart.getTime() === this.currWeek.startDay.getTime()
      );

      if (currGoal) {
        currGoal.goal = goal;
        await axios.put(`/api/goals/${currGoal._id}`, { goal });
      } else {
        this.weekGoals.push({
          weekStart: this.currWeek.startDay,
          goal,
        });

        await axios.post(`/api/goals/`, {
          goal,
          weekStart: this.currWeek.startDay,
        });

        this.update();
      }
    },
  },

  computed: {
    currGoal() {
      const currGoal = this.weekGoals.find(
        (weekGoal) =>
          weekGoal.weekStart.getTime() === this.currWeek.startDay.getTime()
      );
      return currGoal?.goal || "Unset";
    },

    weeks() {
      const weeks = [];
      for (let story of this.stories) {
        for (let task of story.tasks) {
          if (task.completionDate === null) continue;
          const index = weeks.findIndex(
            (week) =>
              week.startDate.getTime() ===
              getStartOfWeek(task.completionDate).getTime()
          );
          if (index === -1) {
            const startDate = getStartOfWeek(task.completionDate);
            const endDay = getStartOfWeek(task.completionDate);
            endDay.setDate(startDate.getDate() + 6);
            weeks.push({
              startDate,
              endDay,
              taskSum: 1,
              storySum: 0,
              totalSum: 1,
            });
          } else {
            weeks[index].taskSum++;
            weeks[index].totalSum++;
          }
        }

        if (story.completionDate === null) continue;
        const index = weeks.findIndex(
          (week) =>
            week.startDate.getTime() ===
            getStartOfWeek(story.completionDate).getTime()
        );
        if (index === -1) {
          const startDate = getStartOfWeek(story.completionDate);
          const endDay = getStartOfWeek(story.completionDate);
          endDay.setDate(startDate.getDate() + 6);
          weeks.push({
            startDate,
            endDay,
            taskSum: 0,
            storySum: story.points,
            totalSum: story.points,
          });
        } else {
          weeks[index].storySum += story.points;
          weeks[index].totalSum += story.points;
        }
      }

      const index = weeks.findIndex(
        (week) =>
          week.startDate.getTime() ===
          getStartOfWeek(this.currWeek.startDay).getTime()
      );
      if (index === -1) {
        weeks.push({
          startDate: this.currWeek.startDay,
          endDay: this.currWeek.endDay,
          taskSum: 0,
          storySum: 0,
          totalSum: 0,
        });
      }

      const weeksWithGoals = weeks.map((week) => {
        const weekGoal = this.weekGoals.find(
          (goal) => goal.weekStart.getTime() === week.startDate.getTime()
        );
        if (weekGoal !== undefined) return { ...week, goal: weekGoal.goal };
        else return week;
      });

      return weeksWithGoals;
    },
  },
};
</script>

<style scoped>
main {
  display: grid;
  grid-template-columns: 9fr 6fr;
  margin: 0 5vw;
}

#tasks,
#goals {
  margin: 0 1.25vw;
  border: 0.25rem solid;
  padding: 0.5rem 1.25vw;
}

#goals {
  padding: 2rem 5vw;
}

#goals table {
  width: 100%;
}

#currGoal {
  text-align: left;
}

.change {
  color: blue;
  margin-left: 0.5rem;
}

.change:hover {
  cursor: pointer;
}

.story {
  display: flex;
  flex-direction: column;
}

.story > * {
  text-align: left;
  margin: 0.25rem 0;
  margin-left: 2.5vw;
}

.story h3 {
  margin: 1rem 0 0.5rem;
}

.story .task {
  display: flex;
  align-content: left;
  gap: 1.25vw;
}
</style>
