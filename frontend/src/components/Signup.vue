<template>
  <div class="auth-container">
    <h2>Sign up</h2>
    <form @submit.prevent="handleSignup">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Re-enter password" required />
      <button type="submit">Sign up</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <router-link to="/login">Already have an account? Log in!</router-link>
  </div>
</template>

<script>
import axios from '../axios'

export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    }
  },
  methods: {
    async handleSignup() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords are not matching!');
        return;
      }

      try {
        const res = await axios.post('/signup', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        alert("Successful sign up!");
        this.$router.push('/login');

      } catch(err) {
        console.error('Error while signing up!', err.response?.data || err);
        alert('Something is wrong.');
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 5rem auto;
  border: 2px solid #03045e;
  padding: 2rem;
  background: white;
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

.error {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}
</style>