<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        style="padding: 0px 17px"
      >
        <md-card>
          <md-card-content>
            <description-table></description-table>
          </md-card-content>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <description-import></description-import>
          </md-card-content>
        </md-card>
        <button type="submit" class="btn-finalysave">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { DescriptionImport, DescriptionTable } from "@/components";

export default {
  components: {
    DescriptionImport,
    DescriptionTable,
  },
};
</script>

<style>
.btn-finalysave {
  background-color: orange;
  color: white;
  border: none;
  padding: 8px 21px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  float: right;
}
</style>
