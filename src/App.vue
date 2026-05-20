<template>
  <div>
    <Navbar v-if="$store.getters['auth/isAuthenticated']" />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>

