<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="login-card card shadow-lg border-0">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <h3 class="card-title mb-1">Welcome Back</h3>
          <p class="text-muted">Sign in to manage your stock inventory</p>
        </div>

        <div class="mb-3">
          <label class="form-label">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control form-control-lg"
            placeholder="name@example.com"
          />
        </div>

        <div class="mb-4">
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control form-control-lg"
            placeholder="Enter your password"
          />
        </div>

        <button class="btn btn-primary btn-lg w-100" @click="loginUser">
          Login
        </button>

        <p v-if="error" class="mt-3 text-danger text-center">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async loginUser() {
      try {
        await this.login({
          email: this.email,
          password: this.password,
        });
        this.$router.push("/stocks");
      } catch (err) {
        this.error = err.response?.data?.message || err.message || "Invalid credentials";
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  background: radial-gradient(circle at top left, rgba(13, 110, 253, 0.15), transparent 35%),
    radial-gradient(circle at bottom right, rgba(32, 201, 151, 0.12), transparent 30%),
    #f8fafc;
}
.login-card {
  width: min(100%, 420px);
  border-radius: 1.25rem;
}
</style>
