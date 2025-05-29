<template>
  <div class="quiz-container">
    <!-- COUNTDOWN -->
    <div v-if="!gameStarted" class="countdown">
      <h2>Duel starts in {{ countdown }}...</h2>
    </div>

    <!-- QUIZ -->
    <div v-else-if="currentQuestionIndex < questions.length" class="question-section">
      <h3>{{ currentQuestion.question_text }}</h3>

      <!-- Single type questions -->
      <div v-if="currentQuestion.question_type === 'single'" class="answers">
        <button
          v-for="ans in currentQuestion.answers"
          :key="ans.id"
          class="answer-btn"
          :disabled="answerSubmitted"
          @click="submitAnswer(ans.id)"
        >
          {{ ans.answer_text }}
        </button>
      </div>

      <!-- Sort type questions -->
      <div v-else-if="currentQuestion.question_type === 'sort'" class="sortable-list">
        <draggable v-model="sortedAnswers" :animation="200" item-key="id">
          <template #item="{ element, index }">
            <div class="sortable-item"> {{ index + 1 }}. {{ element.answer_text }} </div>
          </template>
        </draggable>
      </div>

<!-- Submit button samo za sort pitanja -->
      <button v-if="currentQuestion.question_type === 'sort'" @click="submitAnswer" :disabled="answerSubmitted" >
        {{ answerSubmitted ? 'Answered' : 'Submit Answer' }}
      </button>
      
      <p>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</p>
    </div>

    <!-- WAITING FOR OPPONENT / END -->
    <div v-else class="finished">
      <h2>Duel ended!</h2>
      <p>Waiting for opponent or final results…</p>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import axios from '../axios';
import Draggable from 'vuedraggable';

export default {
  name: 'DuelQuiz',
  components: { draggable: Draggable },
  data() {
    return {
      // params iz rute: moraš definirati rutu npr. /duel/:duelId/:duelCode
      duelId: Number(this.$route.params.duelId),
      duelCode: this.$route.params.duelCode,

      playerId: Number(localStorage.getItem('user_id')),
      socket: null,

      questions: [],
      currentQuestionIndex: 0,

      countdown: 5,
      gameStarted: false,
      questionStartTime: null,

      // za odgovore
      selectedAnswer: null,
      sortedAnswers: [],
      answerSubmitted: false
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    }
  },
  async created() {
    // 1) Spoji se na Socket.IO
    this.socket = io('http://localhost:3000');

    // 2) Uđi u sobu
    this.socket.emit('join-duel', {
      duelCode: this.duelCode,
      userId: this.playerId
    });

    // 3) Čekaj signal da kreće duel
    this.socket.on('duel-started', () => {
      this.startCountdown();
    });

    // 4) Primi rezultat svakog odgovora (možeš izlistati bodove)
    this.socket.on('answer-result', payload => {
      console.log('Answer result', payload);
      // ovdje možeš osvježiti scoreboard
    });

    // 5) Primi kraj duela
    this.socket.on('duel-ended', payload => {
      localStorage.setItem('duelResults', JSON.stringify(payload));
      alert(payload.message);
      this.$router.push(`/duel/${this.duelId}/results`);
    });

    // 6) Dohvati pitanja
    try {
      const res = await axios.get('/duel-questions');
      this.questions = res.data.questions;
      // pripremi sortiranje za prvu pitanja
      if (this.currentQuestion.question_type === 'sort') {
        this.sortedAnswers = [...this.currentQuestion.answers];
      }
    } catch (err) {
      console.error('Greška pri dohvaćanju pitanja:', err);
    }
  },
  methods: {
    startCountdown() {
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.gameStarted = true;
          this.questionStartTime = Date.now();
        }
      }, 1000);
    },
    submitAnswer(chosenId = null) {
      this.answerSubmitted = true;
      const timeTaken = Date.now() - this.questionStartTime;

      if(this.currentQuestion.question_type === 'single') {
        this.selectedAnswer = chosenId;
      }

      // pripremi payload po onome što duelScoring.js očekuje
      const payload = {
        duelId: this.duelId,
        playerId: this.playerId,
        questionId: this.currentQuestion.id,
        timeTaken,
        questionType: this.currentQuestion.question_type,
        // za single treba tekst odgovora, za sort niz tekstova
        answer:
          this.currentQuestion.question_type === 'single'
            ? this.currentQuestion.answers.find(a => a.id === this.selectedAnswer).answer_text
            : this.sortedAnswers.map(a => a.answer_text)
      };

      // pošalji na server
      this.socket.emit('submit-answer', payload);

      // nakon kratkog delaya idi na sljedeće pitanje
      setTimeout(() => this.nextQuestion(), 500);
    },
    nextQuestion() {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.questions.length) {
        // resetiraj state za novo pitanje
        this.answerSubmitted = false;
        this.selectedAnswer = null;
        if (this.currentQuestion.question_type === 'sort') {
          this.sortedAnswers = [...this.currentQuestion.answers];
        }
        this.questionStartTime = Date.now();
      }
      // inače će backend emitirati 'duel-ended' kad oba igrača završe
    }
  }
};
</script>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.countdown h2 {
  font-size: 2.5rem;
  color: #0077b6;
}

.question-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answer-btn {
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #023e8a;
  border-radius: 6px;
  color: #0077b6;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.answer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.answer-btn:hover:not(:disabled) {
  background: #caf0f8;
}

.sortable-list {
  margin: 1rem 0;
}

.sortable-item {
  padding: 0.75rem;
  background: #caf0f8;
  border: 1px solid #0077b6;
  border-radius: 4px;
  cursor: grab;
}

button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #0077b6;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.finished h2 {
  color: #023e8a;
}
</style>