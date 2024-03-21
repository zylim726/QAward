<template>
  <div>
    <md-card-content>
      <div class="flex-container">
        <div class="person-image">
          <img
            class="img"
            src="../../assets/img/new_logo.png"
            alt="Person Image"
          />
          <label class="titleHeader" style="margin-left: 22px !important"
            >Mr Lim</label
          >
          <label
            class="titleHeader"
            style="margin-left: 21px !important; font-size: 13px !important"
            >10/2/2023</label
          >
        </div>
        <form @submit.prevent="submitForm" class="form-container">
          <div class="form-row">
            <div class="form-group flex-item-left">
              <label for="Vendor"><b>Vendor:</b></label>
              <select id="Vendor" class="form-control Vendor-dropdown" required>
                <option value="" disabled selected hidden>Select Vendor</option>
                <option value="Wekwork">Wekwork</option>
                <option value="Topslen">Topslen</option>
              </select>
            </div>
            <div class="form-group flex-item-right">
              <label for="Remark"><b>Remark:</b></label>
              <input
                type="text"
                id="Remark"
                class="form-control remark-input"
                placeholder="Enter Remark"
              />
            </div>
          </div>
        </form>
      </div>
    </md-card-content>
  </div>
</template>

<script>
export default {
  methods: {
    submitForm() {
      // Handle form submission
    },
  },
};
</script>

<style>
/* Custom card styling */
.custom-card {
  width: 450px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fef4e4;
}

/* Flex container to arrange items in a row */
.flex-container {
  display: flex;
  align-items: center;
}

/* Style for the person image */
.person-image {
  width: 100px;
  margin-right: 20px;
}

.person-image img {
  width: 100%;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Form layout */
.form-container {
  flex: 1;
}

/* Form row styling */
.form-row {
  display: flex;
}

/* Flex item for the left part (dropdown) */
.flex-item-left {
  flex: 0 0 30%;
}

/* Flex item for the right part (input field) */
.flex-item-right {
  flex: 0 0 70%;
}

/* Additional styling for form fields and labels */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  color: #333;
}

/* Vendor dropdown styling */
.Vendor-dropdown {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Remark input styling */
.remark-input {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Hover effect for dropdown options */
.Vendor-dropdown option:hover {
  background-color: #f0f0f0;
}
</style>
