<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-content>
            <button @click="backToComparison" class="transparentButton" style="margin-left: 10px;">
              <div class="tooltip">
                <span class="tooltiptext" style="width: 160px; margin-left: -29px !important; margin-bottom: -105px;">
                  Back to comparison pages.
                </span>
                <md-icon class="mdIcon">arrow_back_ios</md-icon>
              </div>
            </button>
            <div class="table-container" style="margin-top: 0px !important;">
              <table class="nested-table" v-if="revision.length">
                <thead>
                  <tr v-if="errorMessage">
                    <td colspan="4" class="message">{{ errorMessage }}</td>
                  </tr>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Version</th>
                    <th scope="col">Date</th>
                    <th>Create By</th>
                    <th>Reject By</th>
                    <th>Remarks</th>
                    <th scope="col" style="text-align: right;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(rv, index) in revision" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>Version {{ rv.version }}</td>
                    <td>{{ formatDate(rv.createdAt) }}</td>
                    <td>{{ rv.created_by }}</td>
                    <td>{{ rv.remark?.updated_by }}</td>
                    <td>{{ rv.remark?.approval_remarks || '' }}</td>
                    <td>
                      <button class="btn-save" @click="downloadDocument(rv.document_api)">
                        Download Revision
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else style="text-align: center;">No revision available</div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import RevisionController from "@/services/controllers/RevisionController.js";
import { config } from "@/services";

export default {
  data() {
    return {
      revision: [],
      errorMessage: "",
    };
  },
  mounted() {
    this.accessRevision();
  },
  methods: {
    backToComparison() {
      const id = this.$route.query.cqId;
      const storedProjectId = localStorage.getItem('projectId');
      this.$router.push({
        path: '/comparison',
        query: { cqID: id, projectID: storedProjectId }
      });
    },
    formatDate(date) {
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-GB', options).replace(/ /g, '-');
    },
    async accessRevision() {
      try {
        const id = this.$route.query.cqId;
        const processedData = await RevisionController.accessRevision(id);
   
        this.revision = processedData;
      } catch (error) {
        this.errorMessage = "Error: " + error.message;
      }
    },
    async downloadDocument(url) {
      try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const fullUrl = `${apiHost}${url}`;

        const response = await fetch(fullUrl, {
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "revision.xlsx");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        this.errorMessage = "Error issue : download revision document fail: " + error.message;
      }
    },
  },
};
</script>

<style scoped>
.message {
  color: red;
  text-align: center;
}
</style>
