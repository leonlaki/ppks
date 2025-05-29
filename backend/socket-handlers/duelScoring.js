const pool = require('../db');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('submit-answer', async ({ duelId, playerId, questionId, answer, timeTaken, questionType }) => {
      try {
        const duelRes = await pool.query('SELECT * FROM duels WHERE id = $1', [duelId]);
        if (duelRes.rows.length === 0) return;
        const duel = duelRes.rows[0];

        const isPlayer1 = duel.player1_id === playerId;
        const scoreField = isPlayer1 ? 'player1_score' : 'player2_score';
        const answersField = isPlayer1 ? 'player1_answers' : 'player2_answers';

        let correct = false;
        let points = 0;

        //'Single' type question
        if (questionType === 'single') {
          const res = await pool.query(
            `SELECT is_correct FROM answers WHERE question_id = $1 AND answer_text = $2`,
            [questionId, answer]
          );
          correct = res.rows.length > 0 && res.rows[0].is_correct;
          if (correct) {
            points = Math.max(10 - Math.floor(timeTaken / 1000), 1);
          } 
        } else if (questionType === 'sort') { //'Sort type question'
          const correctRes = await pool.query(
            `SELECT answer_text FROM answers WHERE question_id = $1 ORDER BY correct_position ASC`,
            [questionId]
          );
          const correctSequence = correctRes.rows.map(row => row.answer_text.trim());
          const userSequence = answer.map(text => text.trim());
          correct = JSON.stringify(correctSequence) === JSON.stringify(userSequence);
          if (correct) {
            points = Math.max(15 - Math.floor(timeTaken / 1000), 3);
          } 
        }

        const updatedScore = duel[scoreField] + points;
        const existingAnswers = duel[answersField] || [];
        const updatedAnswers = [...existingAnswers, { questionId, answer, timeTaken }];

        await pool.query(
          `UPDATE duels SET ${scoreField} = $1, ${answersField} = $2, updated_at = NOW() WHERE id = $3`,
          [updatedScore, JSON.stringify(updatedAnswers), duelId]
        );

        const roomName = `duel-${duel.duel_code}`;
        io.to(roomName).emit('answer-result', {
          playerId,
          correct,
          points,
          currentScore: updatedScore
        });

        const updatedDuelRes = await pool.query(`SELECT * FROM duels WHERE id = $1`, [duelId]);
        const updatedDuel = updatedDuelRes.rows[0];

        const p1Answers = updatedDuel.player1_answers || [];
        const p2Answers = updatedDuel.player2_answers || [];
        const totalQuestions = updatedDuel.questions.length; //length = number of questions in a duel

        if(p1Answers.length >= totalQuestions && p2Answers.length >= totalQuestions) { //operator >= in for edge-cases
            const winner = updatedDuel.player1_score > updatedDuel.player2_score
            ? updatedDuel.player1_id : updatedDuel.player2_score > updatedDuel.player1_score ? updatedDuel.player2_id : null;

            await pool.query(`UPDATE duels SET status = 'finished', updated_at = NOW() WHERE id = $1`, [duelId]);

            io.to(roomName).emit('duel-ended', {
                winnerId: winner,
                player1Score: updatedDuel.player1_score,
                player2Score: updatedDuel.player2_score,
                message: winner ? `Player ${winner} wins!` : `It's a draw!`
            });
        }
      } catch (err) {
        console.error('Error in scoring logic:', err);
      }
    });
  });
};