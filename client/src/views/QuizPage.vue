<template>
    <div class="quiz-page">
      <div class="title-container">
        <h1>Quiz</h1>
      </div>
      <p class="quiz-subtitle" v-if="!currentQuiz && !loading">Select your quiz subject!</p>
      <div class="quiz-categories" v-if="!currentQuiz && !loading">
        <div
          class="quiz-card"
          @click="startQuiz('basic-knowledge')"
          :class="{ disabled: quizStarted }"
        >
          <img src="/images/basic-knowledge.png" alt="Basic Knowledge" class="quiz-image" />
          <p class="quiz-title">Basic Knowledge</p>
        </div>
        <div
          class="quiz-card"
          @click="startQuiz('tasting-cheese')"
          :class="{ disabled: quizStarted }"
        >
          <img src="/images/tasting-cheese.png" alt="Tasting Cheese" class="quiz-image" />
          <p class="quiz-title">Tasting Cheese</p>
        </div>
        <div
          class="quiz-card"
          @click="startQuiz('pairing-cheese')"
          :class="{ disabled: quizStarted }"
        >
          <img src="/images/pairing-cheese.png" alt="Pairing Cheese" class="quiz-image" />
          <p class="quiz-title">Pairing Cheese</p>
        </div>
      </div>
      <div v-if="loading" class="loading-indicator">
        <p>Loading quiz...</p>
      </div>
      <div v-if="currentQuiz" class="question-box">
        <h2>Question {{ currentQuestionIndex + 1 }}</h2>
        <p>{{ currentQuiz[currentQuestionIndex].question }}</p>
        <div class="answers">
          <div
            v-for="(answer, index) in currentQuiz[currentQuestionIndex].reponses"
            :key="`question-${currentQuestionIndex}-answer-${index}`"
            class="answer-option"
            @click="selectAnswer(answer.reponse)"
            :class="{ selected: selectedAnswer === answer.reponse }"
          >
            <input
              type="radio"
              :id="`answer-${index}`"
              :name="'question-' + currentQuestionIndex"
              :value="answer.reponse"
              v-model="selectedAnswer"
            />
            <label :for="`answer-${index}`">{{ answer.reponse }}</label>
          </div>
        </div>
        <button
          class="next-button"
          :disabled="selectedAnswer === null || quizCompleted"
          @click="submitAnswer"
        >
          <span>&#x27A4;</span>
        </button>
      </div>
      <div v-if="quizCompleted" class="quiz-completed">
        <h2>Quiz completed!</h2>
        <p>Your score: {{ score }}/{{ currentQuiz.length }}</p>
        <p>Your best score: {{ bestScore }}</p>
        <button class="back-to-quiz-selection" @click="resetQuiz">Back to Quiz Selection</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        currentQuiz: null,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        score: 0,
        bestScore: 0, // Nouveau champ pour stocker le meilleur score
        quizCompleted: false,
        quizStarted: false,
        loading: false,
      };
    },
    methods: {
      async startQuiz(category) {
    try {
      this.loading = true;
  
      // Charger les questions du quiz
      const response = await axios.get(`http://localhost:3000/api/quiz/${category}`);
      this.currentQuiz = response.data.quizz;
      this.currentQuiz.name = category; // Ajouter un nom si non fourni
  
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.quizCompleted = false;
      this.quizStarted = true;
      this.selectedAnswer = null;
  
      // Charger le meilleur score de l'utilisateur
      const bestScoreResponse = await axios.get(
        `http://localhost:3000/api/quiz/${category}/best-score`
      );
      this.bestScore = bestScoreResponse.data.best_score;
    } catch (error) {
      console.error("Error loading quiz:", error);
      alert("Failed to load the quiz. Please try again later.");
    } finally {
      this.loading = false;
    }
  },
      selectAnswer(answer) {
        this.selectedAnswer = answer;
      },
      async submitAnswer() {
    if (!this.quizCompleted) {
      const correctAnswer = this.currentQuiz[
        this.currentQuestionIndex
      ].reponses.find((r) => r.correct).reponse;
  
      if (this.selectedAnswer === correctAnswer) {
        this.score++;
      }
  
      this.selectedAnswer = null;
  
      if (this.currentQuestionIndex < this.currentQuiz.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.quizCompleted = true;
        this.quizStarted = false;
  
        // Vérifiez si currentQuiz.name est défini
        const quizName = this.currentQuiz.name || "unknown";
  
        try {
          // Mettre à jour le meilleur score
          await axios.post("http://localhost:3000/api/quiz/update-score", {
            quizName,
            score: this.score,
          });
  
          // Recharger le meilleur score
          const bestScoreResponse = await axios.get(
            `http://localhost:3000/api/quiz/${quizName}/best-score`
          );
          this.bestScore = bestScoreResponse.data.best_score;
        } catch (error) {
          console.error("Error updating or fetching best score:", error);
        }
      }
    }
  },
  
      resetQuiz() {
        this.currentQuiz = null;
        this.quizCompleted = false;
        this.quizStarted = false;
        this.bestScore = 0;
      },
    },
  };
  </script>
  
  
    
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap');
  
  .quiz-page {
      text-align: center;
      margin: 20px;
      font-family: 'Rubik', sans-serif;
  }
  
  h1 {
      font-size: 36px;
      font-weight: bold;
      color: #5f4b8b;
  }
  
  .quiz-subtitle {
      font-size: 20px;
      color: #333;
      margin-bottom: 30px;
  }
  
  .quiz-categories {
      display: flex;
      justify-content: center;
      gap: 30px;
  }
  
  .quiz-card {
      background-color: #fdf6e4;
      border-radius: 15px;
      width: 200px;
      height: 250px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
  }
  
  .quiz-card.disabled {
      cursor: not-allowed;
      opacity: 0.5;
  }
  
  .quiz-card:hover:not(.disabled) {
      transform: translateY(-10px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  .quiz-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 15px;
      object-fit: cover;
  }
  
  .quiz-title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #333;
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
      padding-bottom: 70px;
  }
  
  .answers {
      display: flex;
      flex-direction: column;
      gap: 10px;
  }
  
  .answer-option {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      border-radius: 10px;
      background-color: #e8f0fe;
      transition: background-color 0.3s ease;
      cursor: pointer;
  }
  
  .answer-option.selected {
      background-color: #d0e2fc;
      border: 2px solid #007bff;
  }
  
  .answer-option input {
      margin-right: 15px;
      cursor: pointer;
  }
  
  .answer-option label {
      font-size: 16px;
      color: #333333;
      cursor: pointer;
  }
  
  .next-button {
  position: absolute;
  bottom: 10px; 
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #2ecc71;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  font-size: 22px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  
  .next-button:hover {
      background-color: #27ae60;
      transform: scale(1.1);
  }
  
  .title-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  }
  
  .title-container h1 {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 3rem;
  color: #575dce;
  background-color: #f5f3e7;
  padding: 0 15px; 
  margin-left: 10%; 
  z-index: 1;
  }
  
  .title-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px; 
  background-color: black; 
  z-index: 0;
  }
  .title-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  }
  
  .title-container h1 {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 3rem;
  color: #575dce; 
  background-color: #f5f3e7; 
  padding: 0 15px;
  margin-left: 10%;
  z-index: 1;
  }
  
  .title-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: black;
  z-index: 0;
  }
  
  .back-to-quiz-selection {
      font-family: 'Rubik', sans-serif;
      background-color: #f5f3e7; 
      color: #575dce; 
      border: 2px solid #575dce;
      border-radius: 25px;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
  }
  
  .back-to-quiz-selection:hover {
      background-color: #575dce;
      color: #f5f3e7;
      transform: scale(1.05);
  }
  

  .loading-indicator {
      font-size: 18px;
      font-weight: bold;
      color: #575dce;
  }
  
  .quiz-completed p {
    font-size: 18px;
    color: #333;
  }
  
  .quiz-completed p:nth-child(2) {
    font-weight: bold;
    color: #575dce;
  }
  
  </style>