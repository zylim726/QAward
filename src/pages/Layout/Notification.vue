<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <md-card style="margin: 31px 0px !important">
          <md-card-content>
            <notification-table></notification-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { NotificationTable } from "@/components";

export default {
  components: {
    NotificationTable,
  },
};
</script>
