<template>
  <md-card-content>
    <label class="titleHeader">Project Control Approval : </label><br />
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label
          ><b>Project Site:</b>
          <h3 class="titleHeader">AR496</h3></label
        >
      </div>

      <div class="form-group">
        <label for="Admin"><b>Access Permission:</b></label>
        <select id="Admin" class="form-control Admin-dropdown" required>
          <option value="Wekwork">3</option>
          <option value="Topslen">4</option>
        </select>
      </div>

      <div class="form-group">
        <label for="Admin"><b>Admin 1:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Admin"
          required
        />
      </div>

      <div class="form-group">
        <label for="Admin"><b>Admin 2:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Admin "
          required
        />
      </div>

      <div class="form-group">
        <label for="Admin"><b>Admin 3:</b></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Admin"
          required
        />
      </div>

      <button type="submit" class="btn-save">Save</button><br />
    </form>
    <br />
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
