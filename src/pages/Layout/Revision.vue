<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <div class="table-container" style="margin-top: 0px !important;">
              <table class="nested-table"  v-if="revision.length">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Revision</th>
                    <th scope="col">Date</th>
                    <th scope="col" style="text-align: right;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(rv, index) in revision" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ rv.version }} {{ index + 1 }}</td>
                    <td>{{ rv.createdAt }}</td>
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
      cqId: 0,
    };
  },
  mounted() {
    this.accessRevision();
  },
  methods: {
    async accessRevision() {
      try {
        const id = this.$route.query.cqId;
        const processedData = await RevisionController.accessRevision(id);
        console.log('response', processedData);
        this.revision = processedData;
      } catch (error) {
        this.errorMessage = "Error fetching project data: " + error.message;
      }
    },
    async downloadDocument(url) {
  try {
    console.log('Attempting to download document from:', url);

    const headers = config.getHeadersWithToken(); 
    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    
    // Set the filename and extension for the downloaded file
    link.setAttribute("download", "revision.xlsx");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading document:", error);
    // Optionally handle different types of errors here
    if (error instanceof TypeError) {
      console.error('Network error or fetch API issue');
    } else {
      console.error('Other error:', error.message);
    }
  }
},


  },
};
</script>
