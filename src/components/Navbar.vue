<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/stocks">Stock Manager</router-link>

      <div class="collapse navbar-collapse show">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/stocks">Stock List</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/bulk">Bulk Stock</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary btn-sm" @click="logoutAndRedirect">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    logoutAndRedirect() {
      this.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.navbar {
  min-height: 70px;
}
</style>
