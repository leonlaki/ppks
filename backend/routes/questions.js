const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/duel-questions', async (req, res) => {
    try {
        const questionsResult = await pool.query(`SELECT * FROM questions ORDER BY RANDOM() LIMIT 5`);
        const questions = questionsResult.rows;

        const questionsList = [];

        for(const question of questions) {
            const answersResult = await pool.query(`SELECT id, answer_text, extra_info, correct_position
            FROM answers WHERE question_id = $1`, [question.id]);
            
            questionsList.push({
                id: question.id,
                question_text: question.question_text,
                question_type: question.question_type,
                answers: answersResult.rows
            });
        }

        res.json({ questions: questionsList })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error fetching duel questions');   
    }
});

module.exports = router;