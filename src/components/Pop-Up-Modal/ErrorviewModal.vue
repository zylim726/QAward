<template>
  <div class="modal" :class="{ 'is-active': showerror }">
    <div class="Inforrmodal-background" @click="closeModal"></div>
    <div class="Inforrmodal-content">
      <div class="Inforbox">
        <h1 class="Inforrtitle">Error Message</h1>
         <hr style="margin-top: -45px" />
        <br /><br />
        <div class="error-container">
          <div class="error">
            <h1>{{ errorViewStatus }}</h1>
            <h2>
              {{ errorViewMessage }}
            </h2>
          </div>
          <div class="stack-container">
            <div v-for="(card, index) in cards" :key="index" class="card-container">
              <div class="perspec" :style="`--spreaddist: ${card.spreadDist}px; --scaledist: ${card.scale}; --vertdist: ${card.vertDist}px`">
                <div class="card">
                  <div class="writing">
                    <div class="topbar">
                      <div class="red"></div>
                      <div class="yellow"></div>
                      <div class="green"></div>
                    </div>
                    <div class="code">
                      <ul>
                        <li v-for="line in card.codeLines" :key="line.id" :style="`--linelength: ${line.length}%;`"></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="closeIcon" @click="closeModal" aria-label="close">
      <md-icon class="mdIcon">close</md-icon>
    </button>
    
  </div>
</template>

<script>
export default {
  props: {
    showErrorModal: {
      type: Boolean,
      required: true
    },
    errorViewMessage: {
      type: String,
      default: ''
    },
    errorViewStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cards: this.generateCards(3), 
    };
  },
  computed: {
    showerror() {
      return this.showErrorModal;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    generateCards(num) {
      const cards = [];
      for (let i = 0; i < num; i++) {
        const codeLines = this.generateCodeLines(Math.floor(Math.random() * 6) + 5); // Generate 5 to 10 lines
        cards.push({
          spreadDist: Math.random() * 150 + 75,
          scale: Math.random() * 0.5 + 0.5,
          vertDist: Math.random() * -30,
          codeLines,
        });
      }
      return cards;
    },
    generateCodeLines(num) {
      const lines = [];
      for (let i = 0; i < num; i++) {
        lines.push({ id: i, length: Math.random() * 70 + 30 }); // Random length between 30% to 100%
      }
      return lines;
    },
  }
};
</script>

