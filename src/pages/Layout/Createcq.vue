<template>
  <div class="content">
    <label class="titleHeader"
      >Step 1 : Create / Import Call of Quotation</label
    >
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-25"
        style="padding: 0px 17px"
      >
        <md-card>
          <latrade-table></latrade-table>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-75"
      >
        <md-card>
          <md-card-content>
            <la-import></la-import>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <br />
    <label class="titleHeader">Step 2 : Create / Import Unit Type </label>
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-25"
        style="padding: 0px 17px"
      >
        <md-card>
          <unittype-table></unittype-table>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-75"
      >
        <md-card>
          <unittype-import></unittype-import>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import {
  LaImport,
  LatradeTable,
  UnittypeTable,
  UnittypeImport,
} from "@/components";

export default {
  components: {
    LaImport,
    LatradeTable,
    UnittypeTable,
    UnittypeImport,
  },
};
</script>
