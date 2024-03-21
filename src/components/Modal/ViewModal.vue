<template>
  <div>
    <button
      type="button"
      class="transparentButton"
      style="margin-right: 10px"
      @click="showModal = !showModal"
    >
      <md-icon style="color: orange">preview</md-icon>
    </button>
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <div class="md-layout" style="padding: 10px">
          <div
            class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50"
          >
            <div class="left-information">
              <form action="#">
                <div class="form-row">
                  <div class="input-data">
                    <input type="text" :value="userData.prepareby" />
                    <div class="underline"></div>
                    <label for="">Prepare By</label>
                  </div>
                </div>
                <div class="form-row">
                  <div class="input-data">
                    <input type="text" :value="userData.acctualDonedate" />
                    <div class="underline"></div>
                    <label for="">Actual Done Date</label>
                  </div>
                </div>
                <div class="form-row">
                  <div class="input-data">
                    <input type="text" :value="userData.date" />
                    <div class="underline"></div>
                    <label for="">Awarding Target Date</label>
                  </div>
                  <div class="input-data">
                    <input type="text" :value="userData.date" />
                    <div class="underline"></div>
                    <label for="">Awarded To</label>
                  </div>
                </div>
                <div class="form-row">
                  <div class="input-data">
                    <input type="text" :value="userData.date" />
                    <div class="underline"></div>
                    <label for="">LA Ref</label>
                  </div>
                  <div class="input-data">
                    <input type="text" :value="userData.date" />
                    <div class="underline"></div>
                    <label for="">LA Date</label>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div
            class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50"
          >
            <button @click="showModal = false" class="close-button">
              <md-icon>close</md-icon>
            </button>
            <div class="view-container">
              <div class="view-item">
                <input type="checkbox" class="view-checkbox" />
                <label class="view-toggle">
                  <div class="view-card">
                    <div class="view-title">Mr Lee</div>
                    <div>
                      Date: 2/14/2024<br />Remarks: Good, using the number 3
                      quotation will be better. That has more advantage.
                    </div>
                  </div>
                </label>
              </div>

              <div class="view-item">
                <input type="checkbox" class="view-checkbox" />
                <label class="view-toggle">
                  <div class="view-card">
                    <div class="view-title">Mr Khew</div>
                    <div>
                      Date: 2/14/2024<br />Remarks: Good, using the number 3
                      quotation will be better. That has more advantage.
                    </div>
                  </div>
                </label>
              </div>

              <div class="view-item">
                <input type="checkbox" class="view-checkbox" />
                <label class="view-toggle">
                  <div class="view-card">
                    <div class="view-title">Mr Chuah</div>
                    <div>
                      Date: 2/14/2024<br />Remarks: Good, using the number 3
                      quotation will be better. That has more advantage.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userData: Object, // Define the prop type as Object
  },
  data() {
    return {
      showModal: false,
    };
  },
};
</script>
