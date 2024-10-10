<template>
  <div class="maintenance-container">
    <div class="rocket-loader" style="margin-left: -100%;">
      <div class="rocket">
        <div class="rocket-extras"></div>
        <div class="jet"><span></span></div>
      </div>
    </div>
    <div class="maintenance-message">
      <h1>We'll be back soon!</h1>
      <p>We're currently undergoing maintenance. Thank you for your patience!</p>
      <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
      <div class="countdown-timer">
        <div class="countdown-item">
          <span class="countdown-number">{{ days }}</span>
          <span class="countdown-label"> Days</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">{{ hours }}</span>
          <span class="countdown-label"> Hours</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">{{ minutes }}</span>
          <span class="countdown-label"> Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">{{ seconds }}</span>
          <span class="countdown-label"> Seconds</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      maintenanceEnd: this.$route.query.end || "unknown", // Get end time from query parameter
    };
  },
  methods: {
    calculateTimeRemaining() {
      const now = new Date();
      const previouse = new Date(this.maintenanceEnd);
      const timeRemaining = previouse - now;

      // Check if the maintenance end date and time is in the future
      if (previouse > now) {
        // Calculate the remaining time
        this.days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      } else {
         window.location.href = '/login';
      }
    },
  },
  mounted() {
    this.calculateTimeRemaining(); // Initial calculation
    setInterval(this.calculateTimeRemaining, 1000); // Update every second
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Ubuntu:400,400i');

*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.maintenance-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 85vh;
  background-color: #f7f7f7;
  text-align: center;
  font-family: 'Ubuntu', sans-serif;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 20px 0;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin: 10px 0;
}

a {
  color: #fef4e4;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.rocket-loader {
  animation: moveParticles 6s linear infinite;
  background: linear-gradient(90deg, gray, transparent 10%) 0 20%/180% 0.2rem repeat-x,
    linear-gradient(90deg, gray, transparent 20%) 0 80%/150% 0.2rem repeat-x,
    linear-gradient(90deg, gray, transparent 5%) 0 65%/100% 0.2rem repeat-x,
    linear-gradient(90deg, gray, transparent 5%) 0 40%/220% 0.2rem repeat-x,
    linear-gradient(0, white, white);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: inset 0 0 60px 0 rgba(0, 0, 0, 0.1);
  height: 125px;
  left: 50%;
  overflow: hidden;
  position: relative; /* Changed to relative to keep the loader centered */
  text-align: center;
  width: 125px;
  margin-bottom: 20px; /* Add some space between the loader and the message */

  &::before {
    animation: blink 1s infinite;
    bottom: 6%;

    left: 0;
    position: absolute;
    right: 0;
  }
}

.countdown-timer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.countdown-item {
  background-color: #fef4e4;

  border-radius: 8px;
  padding: 20px;
  margin: 0 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.countdown-item:hover {
  transform: translateY(-5px);
}

.countdown-number {
  font-size: 2rem;
  font-weight: bold;
}

.countdown-label {
  font-size: 1rem;
  margin-top: 5px;
}

@keyframes moveParticles {
  100% {
    background-position-x: -500rem;
  }
}

/* Existing rocket and animation styles below */
.rocket {
  animation: moveRocket 2s linear infinite;
  background: lightgray;
  background: linear-gradient(darken(red, 20), red, darken(red, 20));
  border-left: 3px solid rgba(0, 0, 0, 0.4);
  border-radius: 50% / 30%;
  height: 15%;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 35%;

  &::before,
  &::after {
    content: "";
    position: absolute;
  }

  &::before {
    animation: rotateFins 1s infinite;
    background: darken(lightgray, 10);
    background: linear-gradient(darken(red, 20), red, darken(red, 20));
    border: 2px solid transparent;
    border-radius: 0 50% 50% 0;
    height: 140%;
    top: 50%;
    transform: translate(0, -50%);
    left: 6px;
    width: 20%;
  }

  &::after {
    border: 7px solid transparent;
    border-left: 14px solid rgba(0, 0, 0, 0.4);
    border-radius: 15%;
    right: -16px;
    top: 2px;
  }

  &-extras {
    animation: moveExtras 1s infinite;
    background: rgba(0, 0, 0, 0.4);
    height: 2px;
    left: 12px;
    margin: -2px 0 0;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 10px;

    &::before,
    &::after {
      content: "";
      position: absolute;
    }

    &::before {
      background: white;
      border-radius: 50%;
      height: 5px;
      right: -7px;
      top: -1px;
      width: 5px;
    }

    &::after {
      background: darken(red, 10);
      border-top: 1px solid darken(red, 30);
      height: 1px;
      left: -10px;
      top: 1px;
      width: 6px;
    }
  }
}

@keyframes moveRocket {
  0%,
  100% {
    transform: translate(-50%, calc(-50% - 1rem));
  }

  50% {
    transform: translate(-50%, calc(-50% + 1rem));
  }
}

@keyframes rotateFins {
  0%,
  100% {
    height: 140%;
  }

  50% {
    border-top: 2px solid darken(red, 30);
    border-bottom: 2px solid darken(red, 30);
    height: 110%;
  }
}

@keyframes moveExtras {
  0%,
  100% {
    transform: translate(0, calc(-50% + 0.1rem));
  }

  50% {
    transform: translate(0, calc(-50% - 0.1rem));
  }
}

.jet {
  position: relative;
  top: -37%;
  left: -14%;
  width: 9px;
  height: 30px;
  margin-left: -5px;
}

.jet span {
  background: red;
  border-radius: 5px;
  height: 60%;
  position: absolute;
  width: 100%;
  left: 0;
  animation: jet 0.1s infinite alternate;
}

@keyframes jet {
  0% {
    top: 0;
  }

  100% {
    top: 40%;
  }
}
</style>
