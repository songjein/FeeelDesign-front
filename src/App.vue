<template>
  <div id="app">
		<Editor></Editor>
  </div>
</template>

<script>
import Editor from './Editor.vue';

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
	components: {
		'Editor': Editor
	}
}
</script>

<style>
#app {
  margin-top: 60px;
}
<style>
