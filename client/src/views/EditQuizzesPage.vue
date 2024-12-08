<template>
  <div class="edit-quizzes-page">
    <!-- Conteneur blanc ajouté -->
    <div class="white-background">
      <!-- Étape 1 : Sélection du quiz -->
      <div v-if="!selectedQuiz" class="quiz-selection">
        <h1>Edit Quizzes</h1>
        <button @click="goToAdminPanel" class="back-to-admin-panel">
        Back to Admin Panel
        </button>
        <div class="admin-cards">
          <div
            v-for="quiz in quizzes"
            :key="quiz"
            class="admin-card"
            @click="selectQuiz(quiz)"
          >
            <img
              :src="`/images/${quiz}.png`"
              :alt="`${quiz} Icon`"
              class="quiz-icon"
            />
            <h3>{{ quiz }}</h3>
            <p>Edit or manage this quiz</p>
          </div>
        </div>
      </div>

      <!-- Étape 2 : Modifier les questions -->
      <div v-else>
        <div class="title-container">
          <h1>Editing: {{ selectedQuiz }}</h1>
        </div>
        <button @click="deselectQuiz" class="back-to-quiz-selection">
          Back to Quiz Selection
        </button>

        <div class="questions-list">
          <div
            v-for="(question, index) in questions"
            :key="index"
            class="question-box"
          >
            <h2>Question {{ index + 1 }}</h2>
            <textarea
              v-model="question.question"
              class="question-text"
              placeholder="Edit the question"
            ></textarea>
            <div class="answers">
              <div
                v-for="(answer, answerIndex) in question.reponses"
                :key="answerIndex"
                class="answer-option"
              >
                <input
                  type="text"
                  v-model="answer.reponse"
                  class="answer-text"
                  placeholder="Answer text"
                />
                <label>
                  <input
                    type="radio"
                    :name="'correct-answer-' + index"
                    :value="answerIndex"
                    v-model="question.correctAnswer"
                  />
                  Correct
                </label>
                <button
                  @click="removeAnswer(index, answerIndex)"
                  class="remove-answer"
                >
                  Remove
                </button>
              </div>
              <button @click="addAnswer(index)" class="add-answer">
                Add Answer
              </button>
            </div>
            <button @click="removeQuestion(index)" class="remove-question">
              Remove Question
            </button>
          </div>
        </div>
        <div class="action-buttons">
          <button @click="addQuestion" class="add-question-button">
            Add Question
          </button>
          <button @click="saveQuiz" class="save-button">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      quizzes: [],
      selectedQuiz: null,
      questions: [],
    };
  },
  methods: {
    async fetchQuizzes() {
      try {
        const response = await axios.get("http://localhost:3000/admin/quizzes");
        this.quizzes = response.data;
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        alert("Failed to fetch quizzes. Please try again later.");
      }
    },
    async selectQuiz(quiz) {
      try {
        const response = await axios.get(
          `http://localhost:3000/admin/quizzes/${quiz}`
        );
        this.selectedQuiz = quiz;
        this.questions = response.data.quizz.map((q) => ({
          ...q,
          correctAnswer: q.reponses.findIndex((r) => r.correct),
        }));
      } catch (error) {
        console.error("Error loading quiz:", error);
        alert("Failed to load the quiz. Please try again later.");
      }
    },
    deselectQuiz() {
      this.selectedQuiz = null;
      this.questions = [];
    },
    addQuestion() {
      this.questions.push({
        question: "",
        reponses: [{ reponse: "", correct: true }],
        correctAnswer: 0,
      });
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);
    },
    addAnswer(questionIndex) {
      this.questions[questionIndex].reponses.push({
        reponse: "",
        correct: false,
      });
    },
    removeAnswer(questionIndex, answerIndex) {
      this.questions[questionIndex].reponses.splice(answerIndex, 1);
    },
    async saveQuiz() {
      const updatedQuiz = {
        quizz: this.questions.map((q) => ({
          question: q.question,
          reponses: q.reponses.map((r, index) => ({
            reponse: r.reponse,
            correct: index === q.correctAnswer,
          })),
        })),
      };

      try {
        await axios.post("http://localhost:3000/admin/quizzes", {
          quizId: this.selectedQuiz,
          content: updatedQuiz,
        });
        alert("Quiz saved successfully!");
      } catch (error) {
        console.error("Error saving quiz:", error);
        alert("Failed to save quiz. Please try again later.");
      }
    },
    goToAdminPanel() {
      this.$router.push('/admin');
    },
  },
  mounted() {
    this.fetchQuizzes();
  },
};
</script>

<style scoped>
.edit-quizzes-page {
  max-width: 900px;
  margin: 20px auto;
  font-family: "Rubik", sans-serif;
}

.white-background {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.back-to-admin-panel {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #5f4b8b;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-to-admin-panel:hover {
  background-color: #4a3b6d;
  transform: scale(1.05);
}

.admin-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.admin-card {
  flex: 1;
  max-width: 200px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
}

.admin-card:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.admin-card img {
  max-width: 50px;
  margin-bottom: 10px;
}

.admin-card h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
  text-transform: capitalize;
}

.admin-card p {
  font-size: 14px;
  color: #666;
}

/* Media query for small screens */
@media (max-width: 768px) {
  .admin-cards {
    flex-direction: column;
  }

  .admin-card {
    max-width: 100%;
  }
}

.question-box {
  margin: 20px auto;
  padding: 25px 30px;
  border-radius: 15px;
  background-color: #f8f8f8;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 650px;
  position: relative;
  padding-bottom: 20px;
}

.question-text {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Rubik", sans-serif;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 10px;
  background-color: #e8f0fe;
  transition: background-color 0.3s ease;
}

.answer-option:hover {
  background-color: #d0e2fc;
}

.answer-text {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: "Rubik", sans-serif;
}

.back-to-quiz-selection {
  display: inline-block;
  margin: 15px 0;
  padding: 10px 20px;
  background-color: #5f4b8b;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-to-quiz-selection:hover {
  background-color: #4a3b6d;
  transform: scale(1.05);
}

button {
  font-family: "Rubik", sans-serif;
  display: inline-block;
  margin: 5px;
  padding: 10px 20px;
  background-color: #5f4b8b;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #4a3b6d;
  transform: scale(1.05);
}

.add-answer {
  margin: 10px 0;
}

.remove-answer,
.remove-question {
  background-color: #e74c3c;
}

.remove-answer:hover,
.remove-question:hover {
  background-color: #c0392b;
}

.add-question-button {
  margin-top: 15px;
  margin-right: 5px;
}

.save-button {
  margin-left: 5px;
  background-color: #2ecc71;
}

.save-button:hover {
  background-color: #27ae60;
}
</style>