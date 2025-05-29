<template>
  <div class="duel-join-container">
    <h2>Join a Duel Room</h2>
    <form @submit.prevent="handleJoin">
      <input
        v-model="duelCode"
        type="text"
        placeholder="Enter Duel Code"
        maxlength="6"
        required
      />
      <button type="submit">Join Duel</button>
    </form>
    <router-link to="/duel">← Back to Duel Home</router-link>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'DuelJoin',
  data() {
    return {
      duelCode: ''
    };
  },
  methods: {
    async handleJoin() {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.post('/duels/join', {
          duelCode: this.duelCode.toUpperCase()
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { id, duel_code } = res.data.duel;

        this.$router.push(`/duel/${id}/${duel_code}`);
      } catch (err) {
        console.error('Failed to join duel:', err.response?.data || err);
        alert(err.response?.data?.error || 'An error occurred.');
      }
    }
  }
};
</script>

<style scoped>
.duel-join-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background: white;
  border: 2px solid #023e8a;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

input {
  width: 90%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #023e8a;
  border-radius: 5px;
  text-transform: uppercase;
}

button {
  background-color: white;
  color: #03045e;
  padding: 0.8rem 2rem;
  border: 2px solid #03045e;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #00b4d8;
}

a {
  display: block;
  margin-top: 1rem;
  color: #0077b6;
  text-decoration: none;
}
</style>