<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <md-card>
          <md-card-content>
            <comparison-table></comparison-table>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <md-card class="md-card-profile">
          <div class="md-card-avatar">
            <img class="img" :src="cardUserImage" />
          </div>

          <md-card-content>
            <h6 class="category text-gray">CEO / Co-Founder</h6>
            <h4 class="card-title">Alec Thompson</h4>
            <p class="card-description">
              Don't be scared of the truth because we need to restart the human
              foundation in truth And I love you like Kanye loves Kanye I love
              Rick Owens’ bed design but the back is...
            </p>
            <md-button class="md-round md-success">Follow</md-button>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>


<script>
import { ComparisonTable } from "@/components";

export default {
  components: {
    ComparisonTable,
  },
  name: "user-card",
  props: {
    cardUserImage: {
      type: String,
      default: require("@/assets/img/marc.jpg"),
    },
  },
  data() {
    return {};
  },
};
</script>
