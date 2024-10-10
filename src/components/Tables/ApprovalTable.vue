<template>
  <div class="container" style="width: 100%;">
    <div class="row" v-for="(cmapproval, index) in cmCQapproval" :key="index" style="width: 100%; margin-top: 15px; margin-right: 10px;align-items: start;">
      <div class="cqbox" style="align-items: start;">
        <div class="left-container">
          <div class="md-card-avatar">
            <img class="img" src="@/assets/img/admin.png" />
          </div>
        </div>
        <div class="right-container">
          <div class="user-info">
            <p class="user-name">Name: {{ cmapproval.user[0].name }}</p>
          </div>
          <h6 style="margin: 8px 0 10px;">Recommend Award To:</h6>
          <h6 class="approvalSelection">
            {{ cmapproval.Call_For_Quotation_Subcon_List.Subcon.name }}
          </h6>
          <h6 style="margin: 8px 0 10px;">Date:</h6>
          <h6 class="approvalSelection">
            {{ formatDate(cmapproval.updatedAt) }}
          </h6>
          <h6 style="margin: 8px 0 10px;">Remarks:</h6>
          <h6 class="approvalRemarks">
            {{ cmapproval.approval_remarks }}
          </h6>
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


</style>
