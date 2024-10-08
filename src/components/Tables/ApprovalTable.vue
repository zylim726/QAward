<template>
  <div class="container" style="width: 100%;">
    <div class="row" v-for="(cmapproval, index) in cmCQapproval" :key="index" style="margin-top: 15px; margin-right: 20px;">
      <div class="cqbox">
        <div class="left-container">
          <div class="md-card-avatar" style="margin-bottom: 315px;">
            <img class="img" src="@/assets/img/admin.png" />
          </div>
        </div>
        <div class="right-container">
          <div class="user-info">
            <p class="user-name">Name: {{ cmapproval.user[0].name }}</p>
          </div>
          <p style="margin: 8px 0 10px;">Recommend Award To:</p>
          <p class="quotation-select" style="background-color: #EFEFEF4D;" disabled>{{ cmapproval.Call_For_Quotation_Subcon_List.Subcon.name }}</p>
          <p style="margin: 8px 0 10px;">Date:</p>
          <p class="quotation-select" style="background-color: #EFEFEF4D;" disabled>{{ formatDate(cmapproval.updatedAt) }}</p>
          <p style="margin: 8px 0 10px;">Remarks:</p>
          <p class="quotation-select" style="background-color: #EFEFEF4D; height: 180px;" disabled>{{ cmapproval.approval_remarks }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cmCQapproval: Array,
  },
  methods: {
    formatDate(dateTimeString) {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return ''; 
      }
      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    },
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
