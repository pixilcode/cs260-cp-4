<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/planning">Planning</router-link> |
      <router-link to="/stories">Stories</router-link>
    </nav>
    <router-view />
    <footer>
      <a href="https://github.com/pixilcode/cs260-cp-3">Github Repository</a>
    </footer>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

footer {
  width: 100%;
  text-align: right;
  margin-top: 2rem;
}

footer a {
  margin-right: 2.5vw;
}
</style>
