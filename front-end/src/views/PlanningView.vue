<template>
  <div id="planning">
    <header>
      <h1>Planning</h1>
      <p>{{ startDay.toDateString() }} — {{ endDay.toDateString() }}</p>
    </header>
    <main>
      <section
        v-for="story in stories"
        :key="story._id"
        class="story"
        :id="`story${story._id}`"
      >
        <h2>{{ story.title }}: {{ story.points }} points</h2>
        <div v-for="task in story.tasks" :key="task._id" class="task">
          <input
            type="checkbox"
            v-model="task.completed"
            :id="`task${task._id}`"
            :name="`task${task._id}`"
            @input="updateStory(story._id, task._id)"
          />
          <label for="task${task._id}">{{ task.title }}</label>
          <a href="#" class="remove" @click="removeTask(story._id, task._id)"
            >(×)</a
          >
        </div>
        <form
          v-if="addTask === story._id"
          @submit.prevent="addToStory(story._id)"
        >
          <input type="text" v-model="newTask" id="newTask" />
          <input type="submit" value="+" />
          <input type="button" value="×" @click="hideAdd" />
        </form>
        <a
          :href="`#story${story._id}`"
          class="addTask"
          @click="showAdd(story._id)"
          v-else
          >(+ add a task)</a
        >
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "PlanningView",

  data() {
    return {
      startDay: new Date(),
      endDay: new Date(),
      stories: [],
      addTask: null,
      newTask: "",
    };
  },

  created() {
    this.update();
  },

  methods: {
    showAdd(storyNumber) {
      this.newTask = "";
      this.addTask = storyNumber;
    },

    hideAdd() {
      this.addTask = null;
    },

    async addToStory(storyNumber) {
      const story = this.stories.find((story) => story._id === storyNumber);
      if (this.newTask !== "")
        await axios.post(`/api/stories/${story._id}/addTask`, {
          title: this.newTask,
        });

      this.update();
      this.newTask = "";
      document.getElementById("newTask").focus();
    },

    async removeTask(storyId, taskId) {
      await axios.delete(`/api/stories/${storyId}/deleteTask/${taskId}`);
      this.update();
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
      const [stories, currWeek] = await Promise.all([
        axios.get("/api/stories"),
        axios.get("/api/currWeek"),
      ]);

      this.startDay = new Date(currWeek.data.startDay);
      this.endDay = new Date(currWeek.data.endDay);
      this.stories = stories.data
        .map((story) => ({
          ...story,
          completionDate:
            story.completionDate === null
              ? null
              : new Date(story.completionDate),
        }))
        .filter(
          (story) =>
            story.status === "In Progress" ||
            (story.status === "Completed" &&
              story.completionDate.getTime() > this.startDay.getTime() &&
              story.completionDate.getTime() <= this.endDay.getTime())
        );
    },
  },
};
</script>

<style scoped>
#planning {
  margin: 0 5vw;
}

.story {
  display: flex;
  flex-direction: column;
}

.story > * {
  text-align: left;
  margin: 0.25rem 0;
  margin-left: 5vw;
}

.story h2 {
  margin: 1rem 0 0.5rem;
}

.story a {
  color: blue;
  text-decoration: none;
}

.story .task {
  display: flex;
  align-content: left;
  gap: 1.25vw;
}

.story form {
  display: flex;
  gap: 0.625rem;
}
</style>
