<template>
    <div class="quiz">
        <h2>{{ currentThemeTitle }}</h2>
        <div v-if="currentQuestion">
        <h3>Question {{ currentQuestionIndex + 1 }}</h3>
        <p>{{ currentQuestion.question }}</p>
        <div class="answers">
            <button
            v-for="(answer, index) in currentQuestion.reponses"
            :key="index"
            @click="checkAnswer(answer)"
            :class="{ correct: answer.correct && showFeedback, wrong: !answer.correct && showFeedback }"
        >
            {{ answer.reponse }}
        </button>
        </div>
    </div>
    <div v-else>
        <p>Quiz terminé ! Votre score : {{ score }} / {{ totalQuestions }}</p>
        <button @click="resetQuiz">Recommencer</button>
    </div>
    </div>
</template>
<script>
export default {
    props: {
    theme: {
        type: String,
        required: true,
    },
    },
    data() {
        return {
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        showFeedback: false,
    };
    },
    computed: {
        currentQuestion() {
        return this.questions[this.currentQuestionIndex];
        },
        totalQuestions() {
        return this.questions.length;
        },
        currentThemeTitle() {
        const themes = {
            "basic-knowledge": "Basic Knowledge",
            "tasting-cheese": "Tasting Cheese",
            "pairing-cheese": "Pairing Cheese",
        };
        return themes[this.theme] || "Quiz";
        },
    },
    methods: {
        async loadQuestions() {
        const response = await fetch(`/data/${this.theme}.json`);
        this.questions = await response.json();
        },
    checkAnswer(answer) {
        if (!this.showFeedback) {
            if (answer.correct) this.score++;
            this.showFeedback = true;

    setTimeout(() => {
            this.showFeedback = false;
            if (this.currentQuestionIndex < this.totalQuestions - 1) {
                this.currentQuestionIndex++;
            } else {
              this.currentQuestionIndex = null; // Fin du quiz
            }
        }, 1000);
        }
    },
    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.showFeedback = false;
    },
    },
    async created() {
    await this.loadQuestions();
    },
};
</script>  
    
<style>
    .quiz {
        font-family: Arial, sans-serif;
    }
    .answers button {
        display: block;
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
    }
    .answers button.correct {
        background: #4caf50;
        color: white;
    }
    .answers button.wrong {
        background: #f44336;
        color: white;
    }
</style>