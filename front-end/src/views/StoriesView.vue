<template>
  <div id="stories">
    <header>
      <h1>Stories</h1>
    </header>
    <main>
      <header>
        <h2>Title</h2>
        <h2>Description</h2>
        <h2>Points</h2>
        <h2>Status</h2>
      </header>
      <section class="story" v-for="story in stories" :key="story._id">
        <p class="storyTitle" v-if="editStory === story._id">
          <input type="text" v-model="story.title" />
        </p>
        <p class="storyTitle" v-else>
          {{ story.title }}
        </p>
        <p class="storyDescription" v-if="editStory === story._id">
          As <input type="text" v-model="story.description.role" /> , I want
          <input type="text" v-model="story.description.goal" />
          so that <input type="text" v-model="story.description.purpose" />.
        </p>
        <p class="storyDescription" v-else>
          As {{ story.description.role }}, I want
          {{ story.description.goal }} so that {{ story.description.purpose }}.
        </p>
        <p class="points" v-if="editStory === story._id">
          <input type="number" v-model="story.points" min="1" />
        </p>
        <p class="points" v-else>{{ story.points }}</p>
        <p class="storyStatus">
          {{ story.status }}
          <span v-if="story.completionDate"
            >({{ story.completionDate.toDateString() }})</span
          >
        </p>
        <div class="controls">
          <input
            type="button"
            value="Done"
            v-if="editStory === story._id"
            @click="doneEditing(story._id)"
          />
          <input type="button" value="Edit" v-else @click="edit(story._id)" />
          <input type="button" value="Delete" @click="remove(story._id)" />
          <input
            type="button"
            value="Plan"
            v-show="story.status === 'Ready'"
            @click="plan(story._id)"
          />
          <input
            type="button"
            value="Remove from Plan"
            v-show="story.status === 'In Progress'"
            @click="removePlan(story._id)"
          />
        </div>
      </section>
      <p id="addStory" @click="newStory">(+ add a story)</p>
    </main>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "StoriesView",

  data() {
    return {
      stories: [],
      editStory: null,
    };
  },

  async created() {
    await this.update();
  },

  methods: {
    edit(storyId) {
      this.editStory = storyId;
    },

    async doneEditing(storyId) {
      this.editStory = null;
      const currStory = this.stories.find((story) => story._id === storyId);
      if (!/\d+/.test(currStory.points) || parseInt(currStory.points) < 1)
        currStory.points = 1;
      else currStory.points = parseInt(currStory.points);

      await axios.put(`/api/stories/${currStory._id}`, {
        title: currStory.title,
        description: currStory.description,
        points: currStory.points,
      });
    },

    async newStory() {
      const story = await axios.post("/api/stories/");
      await this.update();
      this.editStory = story.data._id;
    },

    async plan(storyId) {
      await axios.put(`/api/stories/${storyId}/plan`);
      this.stories.find((story) => story._id === storyId).status =
        "In Progress";
    },

    async removePlan(storyId) {
      await axios.put(`/api/stories/${storyId}/unplan`);
      this.stories.find((story) => story._id === storyId).status = "Ready";
    },

    async remove(storyId) {
      await axios.delete(`/api/stories/${storyId}`);
      await this.update();
    },

    async update() {
      const stories = await axios.get("/api/stories");

      this.stories = stories.data.map((story) => ({
        ...story,
        completionDate:
          story.completionDate === null ? null : new Date(story.completionDate),
      }));
    },
  },
};
</script>

<style scoped>
#stories {
  margin: 0 5vw;
}

main {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 2.5vw;
  align-items: center;
}

main header,
.story {
  grid-column: span 5;
  display: grid;
  grid-template-columns: subgrid;

  margin: 1rem 0.625vw;
  align-items: center;
}

.story * {
  text-align: left;
}

#addStory {
  color: blue;
}

#addStory:hover {
  cursor: pointer;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.controls input[type="button"] {
  text-align: center;
}
</style>
