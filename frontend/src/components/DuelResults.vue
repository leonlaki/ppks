<template>
  <div class="results-container">
    <h2>Duel Results</h2>
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ results.player1_username }}</td>
          <td>{{ results.player1_score }}</td>
        </tr>
        <tr>
          <td>{{ results.player2_username }}</td>
          <td>{{ results.player2_score }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="goHome">← Back to Duel Home</button>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'DuelResults',
  data() {
    return {
      results: null
    }
  },
  async created() {
    const duelId = this.$route.params.duelId;
    const token = localStorage.getItem('token');
    try {
        const { data } = await axios.get(`/duels/${duelId}/results`, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        this.results = data;
    } catch {
        console.log('Cant obtain data!', data);
        this.$router.replace('/duel');
    }
  },
  methods: {
    goHome() {
      this.$router.push('/duel');
    }
  }
}
</script>

<style scoped>
.results-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: white;
  border: 2px solid #0077b6;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

th, td {
  padding: 0.75rem;
  border: 1px solid #0077b6;
}

th {
  background: #0077b6;
  color: white;
}

button {
  background: white;
  color: #0077b6;
  padding: 0.75rem 1.5rem;
  border: 2px solid #023e8a;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  background-color: #90e0ef;
  color: #023e8a;
}
</style>