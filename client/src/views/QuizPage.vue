<template>
  <div class="responsive-title">
  <h1>Quiz</h1>
  <hr />
</div>


  <div>
    <!-- Sélection des thèmes -->
    <div v-if="!quizStarted" class="theme-selection">
        <h3>Select your quiz subject!</h3>
        <div class="themes">
        <div
            v-for="theme in themes"
            :key="theme.name"
            class="theme-card"
            @click="loadQuiz(theme.key)"
        >
            <img :src="theme.image" :alt="theme.name" class="theme-image" />
            <h3>{{ theme.name }}</h3>
        </div>
        </div>
    </div>

    <!-- Questions du quiz -->
    <div v-else class="question-section">
        <h3 class="question-title">Question {{ currentQuestionIndex + 1 }}</h3>
        <p class="question-text">{{ currentQuestion.question }}</p>

        <div class="answers">
        <label
            v-for="(answer, index) in currentQuestion.reponses"
            :key="index"
            class="answer-option"
        >
            <input
            type="radio"
            :name="'question-' + currentQuestionIndex"
            :value="answer.correct"
            v-model="selectedAnswer"
            />
            {{ answer.reponse }}
        </label>
        </div>

        <button class="next-button" @click="nextQuestion">➔</button>
    </div>
    </div>
</template>
  
<script>
    export default {
        data() {
  return {
    themes: [
      { name: "Basic Knowledge", key: "basic-knowledge", image: "/images/basic-knowledge.png" },
      { name: "Tasting Cheese", key: "tasting-cheese", image: "/images/tasting-cheese.png" },
      { name: "Pairing Cheese", key: "pairing-cheese", image: "/images/pairing-cheese.png" },
    ],
    currentTheme: null,
    quizStarted: false,
    quizData: [], // Initialisation correcte
    currentQuestionIndex: 0,
    selectedAnswer: null,
  };
},
    computed: {
        currentQuestion() {
            return this.quizData.length > 0 ? this.quizData[this.currentQuestionIndex] : null;
        },
    },
    methods: {
        async loadQuiz(theme) {
            try {
                const response = await fetch(`/data/${theme}.json`);
                const data = await response.json();
                this.quizData = data.quizz || []; // Assurez-vous que quizz est bien défini
                this.currentTheme = theme;
                this.quizStarted = true;
                this.currentQuestionIndex = 0;
            } catch (error) {
                console.error("Failed to load quiz:", error);
                this.quizData = []; // Initialisez comme tableau vide en cas d'erreur
            }
        },
        nextQuestion() {
        if (this.currentQuestionIndex < this.quizData.length - 1) {
            this.currentQuestionIndex++;
        } else {
            alert("Quiz completed!");
            this.quizStarted = false;
        }
        },
    },
    };
</script>


<style scoped>

   /* Conteneur principal du quiz */
  .quiz-heading {
    font-family: 'Rubik', sans-serif;
    font-weight: 700;
    font-family: 'Rubik';
    font-weight: 700;
    font-size: 2.5rem;
    color: #624A2E;
    text-align: center;
    margin-bottom: 10px;
  }

  .theme-selection,
  .question-section {
    font-family: 'Rubik', sans-serif;
  }
  .theme-selection {
    text-align: center;
    margin-top: 20px;
  }

  .themes {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }

  .theme-card {
    width: 180px;
    padding: 10px;
    border: 2px solid transparent;
    border-radius: 10px;
    text-align: center;
    background-color: #F8F8F8;
    transition: transform 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
  }

  .theme-card:hover {
    transform: scale(1.05);
    border-color: #D4AF37; /* Couleur dorée pour mettre en évidence */
  }

  .theme-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
  }

  /* Section des questions */
  .question-section {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    background-color: #FFFFFF;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .question-title {
    font-size: 1.3rem;
    font-weight: bold;
    color: #333;
    background-color: #FFEDCC;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .question-text {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .answer-option {
    font-family: 'Rubik', sans-serif;
    font-weight: 400;
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #EDF4FF;
    border: 1px solid #D0E3FF;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .answer-option:hover {
    background-color: #D9EFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .answer-option input {
    margin-right: 10px;
  }

  /* Bouton suivant */
  .next-button {
    background-color: #B9FBC0;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    color: #000;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    margin-left: auto;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .next-button:hover {
    background-color: #A2EBAE;
    transform: scale(1.1);
  }

  /* Pied de page */
  .footer {
    margin-top: 50px;
    text-align: center;
    font-size: 0.9rem;
    color: #777;
  }

  .responsive-title {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
}

.responsive-title h1 {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 3rem;
  color: #575dce;
  background-color: #f5f3e7;
  padding: 0 15px; /* Adjust space around title text */
  margin-left: 10%; /* Shift the title slightly to the left */
  z-index: 1;
}

.responsive-title hr {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px; /* Reduce the line thickness */
  background-color: black; /* Change line color to black */
  z-index: 0;
}

/* Design responsive */
@media (max-width: 768px) {
  .responsive-title h1 {
    font-size: 2rem; /* Réduit la taille du titre */
  }
}


</style>

