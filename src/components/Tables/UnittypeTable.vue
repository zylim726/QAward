<template>
  <md-card-content>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label><b>Unit Type:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Unit Type"
          required
        />
      </div>

      <div class="form-group">
        <label><b>Unit Type Quantity:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Unit Type Quantity"
          required
        />
      </div>

      <div class="form-group">
        <label><b>ADJ Factor:</b></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter ADJ Factor"
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
