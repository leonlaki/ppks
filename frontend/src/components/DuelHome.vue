<template>
    <div class = "duel-home">
        <button class="logout-btn" @click="logout">Log Out</button>
        <div class="card">
          <h1>Welcome, {{ username }}!</h1>
          <p>Are your ready to challenge your friend into a 1v1 Football Quiz Duel?</p>

          <div class = "actions">
            <router-link to="/duel/create" class="btn">Create a duel room</router-link>
            <router-link to="/duel/join" class="btn">Join a duel room via code</router-link>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DuelHome',
    data() {
        return {
            username: localStorage.getItem('username') || ''
        };
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('user_id');
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
.duel-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  background: white;
  color: #022757;
  text-align: center;
  padding: 2rem;
}

.card {
  background: white;
  border: 2px solid #03045e;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.logout-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  background-color: white;
  color: #d00000;
  border: 2px solid #d00000;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.logout-btn:hover {
  background-color: #ffcccc;
  color: #9d0208;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  background-color: white;
  color: #03045e;
  border: 2px solid #023e8a;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.2s ease;
}

.btn:hover {
  background-color: #90e0ef;
  color: #023e8a;
}
</style>