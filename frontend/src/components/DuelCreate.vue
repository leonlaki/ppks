<template>
    <div class = "duel-create">
        <h2>Create a Duel Room</h2>
        <button @click="createRoom" class="btn">Generate Room</button>

        <div v-if="duelCode" class="room-info">
            <p>Room created! Share this code with your friend you want to duel!</p>
            <h3>{{ duelCode }}</h3>
            <router-link :to="`/duel/room/${duelCode}`" class="btn">Enter Room</router-link>
        </div>
    </div>
</template>

<script>
import axios from '../axios';

export default {
    name: 'DuelCreate',
    data() {
        return {
            duelCode: ''
        };
    },
    methods: {
        async createRoom() {
            try {
                const token = localStorage.getItem('token');

                const res = await axios.post('/duels/create', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const { id, duel_code } = res.data.duel;
                this.$router.push(`/duel/${id}/${duel_code}`);
            } catch (err) {
                console.error('Failed to create duel: ', err.response?.data || err);
                alert('Could not create duel room!');
            }
        }
    }
}
</script>

<style scoped>
.duel-create {
  max-width: 600px;
  margin: 5rem auto;
  text-align: center;
  color: #03045e;
}

.btn {
  background-color: white;
  color: #0077b6;
  border: 2px solid #0077b6;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.2s;
}

.btn:hover {
  background-color: #caf0f8;
  color: #023e8a;
}

.room-info {
  margin-top: 2rem;
}
</style>