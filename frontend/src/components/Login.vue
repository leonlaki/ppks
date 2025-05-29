<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Log in</button>
    </form>
    <router-link to="/signup">Don't have an account? Sign up!</router-link>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/login', {
          username: this.username,
          password: this.password
        });

        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', user.username);
        localStorage.setItem('user_id', user.id);

        this.$router.push('/duel');
      } catch (err) {
        console.error('Error occured while logging in: ', err.response?.data || err);
        alert("Incorrect credentials!");
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background: white;
  border: 2px solid #03045e;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

input {
  width: 90%;
  padding: 0.8rem;
  border: 1px solid #03045e;
  margin: 1rem 0;
  border-radius: 5px;
  justify-content: center;
}

button {
  background-color: white;
  color: #03045e;
  border: 2px solid #03045e;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

button:hover {
  background-color: #caf0f8;
  color: #03045e;
}

a {
  display: block;
  margin-top: 1rem;
  color: #0077b6;
  text-decoration: none;
}
</style>
