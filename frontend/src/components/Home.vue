<template>
  <div class="home">
    <div class="card">
      <h1>1v1 Duel - Football Quiz</h1>
      <h2>Kolegij: Programska potpora komunikacijskim sustavima</h2>
      <div class="buttons">
        <router-link to="/login" class="btn">Login</router-link>
        <router-link to="/signup" class="btn">Signup</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.home {
  /* ako želiš gradient umjesto bijele pozadine */
  background: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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

h1 {
  color: #03045e;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

h2 {
  color: #03045e;
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  background-color: white;
  color: #03045e;
  border: 2px solid #03045e;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn:hover {
  background-color: #caf0f8;
  color: #03045e;
}
</style>