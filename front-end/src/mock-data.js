function getStartOfWeek(date) {
  const startOfWeek = new Date();
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

const today = new Date();
const prevWeek = new Date();
const prevPrevWeek = new Date();

prevWeek.setDate(today.getDate() - 7);
prevPrevWeek.setDate(today.getDate() - 14);

export const weekGoals = [
  {
    weekStart: getStartOfWeek(prevPrevWeek),
    goal: 14,
  },
  {
    weekStart: getStartOfWeek(prevWeek),
    goal: 10,
  },
];

export const stories = [
  {
    id: 1,
    title: "Complete module for API calls",
    description: {
      role: "an application developer",
      goal: "a module that I can use to make API calls",
      purpose: "I don't have to worry about the details of making an API call",
    },
    status: "Completed",
    completionDate: prevPrevWeek,
    points: 13,
    tasks: [
      {
        id: 0,
        completed: true,
        title: "Get Person ID",
        completionDate: prevPrevWeek,
      },
      {
        id: 1,
        completed: true,
        title: "Get all buildings",
        completionDate: prevPrevWeek,
      },
      {
        id: 2,
        completed: true,
        title: "Get vending machine locations",
        completionDate: prevPrevWeek,
      },
    ],
  },
  {
    id: 2,
    title: "Set up database",
    description: {
      role: "a database user",
      goal: "a database that has all of the information about our products",
      purpose: "I can retrieve that information for use in my application",
    },
    status: "Completed",
    completionDate: prevWeek,
    points: 8,
    tasks: [
      {
        id: 0,
        completed: true,
        title: "Set up recommendations database",
        completionDate: prevPrevWeek,
      },
      {
        id: 1,
        completed: true,
        title: "Write up database schema",
        completionDate: prevWeek,
      },
      {
        id: 2,
        completed: true,
        title: "Document database API",
        completionDate: prevWeek,
      },
      {
        id: 3,
        completed: true,
        title: "Write club database tests",
        completionDate: prevWeek,
      },
    ],
  },
  {
    id: 3,
    title: "Design UI",
    description: {
      role: "a user",
      goal: "a user interface that is intuitive for me to use",
      purpose: "I want to come back to the website again",
    },
    status: "In Progress",
    completionDate: null,
    points: 10,
    tasks: [
      {
        id: 0,
        completed: true,
        title: "Design main menu",
        completionDate: today,
      },
      {
        id: 1,
        completed: true,
        title: "Rearrange navigation menu",
        completionDate: today,
      },
      {
        id: 2,
        completed: false,
        title: "Rewrite about page",
        completionDate: null,
      },
      {
        id: 3,
        completed: false,
        title: "Do user testing",
        completionDate: null,
      },
    ],
  },
  {
    id: 4,
    title: "Take a break",
    description: {
      role: "a human being",
      goal: "to make sure that I am taking adequate breaks",
      purpose: "I can make sure that I am functioning correctly",
    },
    status: "In Progress",
    completionDate: null,
    points: 12,
    tasks: [
      {
        id: 0,
        completed: false,
        title: "Play ping pong",
        completionDate: null,
      },
      {
        id: 1,
        completed: true,
        title: "Take a lunch break",
        completionDate: today,
      },
      {
        id: 2,
        completed: false,
        title: "Go home on time",
        completionDate: null,
      },
    ],
  },
  {
    id: 5,
    title: "Write some more stories",
    description: {
      role: "a team leader",
      goal: "a plan for the next sprint",
      purpose: "the team can have direction on what we need to do next",
    },
    status: "Ready",
    completionDate: null,
    points: 5,
    tasks: [],
  },
];
