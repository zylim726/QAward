<template>
  <md-card-content>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label><b>Category:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Category"
          required
        />
      </div>

      <div class="form-group">
        <label><b>Trade:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Trade"
          required
        />
      </div>

      <div class="form-group">
        <label><b>Location 1:</b></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Location 1"
          required
        />
      </div>

      <div class="form-group">
        <label><b>AA Budget Amount:</b></label>
        <input
          type="number"
          class="form-control"
          placeholder="Enter AA Budget Amount"
          required
        />
      </div>

      <div class="form-group">
        <label><b>Actuall Calling Quotation Date:</b></label>
        <input type="date" class="form-control" required />
      </div>

      <div class="form-group">
        <label><b>Awading Target Date:</b></label>
        <input type="date" class="form-control" required />
      </div>

      <div class="form-group">
        <label><b>Remarks:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Remarks"
          required
        />
      </div>
    </form>
    <button type="submit" class="btn-save">Updated</button><br /><br />
  </md-card-content>
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
