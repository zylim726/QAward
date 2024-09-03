<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success" style="margin-left: 15px;">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail" style="margin-left: 15px;">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <description-import :cqId="cqId"  @message="ImportMessage"  @fail-message="ImportErrorMessage" ></description-import>
          </md-card-content>
        </md-card>
       
      </div>
    </div>
  </div>
</template>

<script>
import { DescriptionImport } from "@/components";

export default {
  components: {
    DescriptionImport,
  },
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
    };
  },
  mounted() {
    this.cqId = this.$route.query.cqId;
  },
  methods: {
    ImportMessage(message) {
      if (!this.UpdateMessage) {
        this.UpdateMessage = message;
        setTimeout(() => {
          this.UpdateMessage = '';
          window.location.reload();
        }, 2000);
      }
    },
    ImportErrorMessage(message) {
      this.FailMessage = message; 
      console.log('this fail message',message);
      setTimeout(() => {
        this.FailMessage = '';
        window.location.reload();
      }, 2000);
    },
  }
};
</script>
