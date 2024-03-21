<template>
  <md-card-content>
    <label class="titleHeader">Create Description : </label><br />
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label>Element <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Element"
          required
        />
      </div>

      <div class="form-group">
        <label>Sub Element <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter Sub Element"
          required
        />
      </div>

      <div class="form-group">
        <label>Sub Sub Element <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Sub Sub Element"
          required
        />
      </div>

      <div class="form-group">
        <label>Description 1</label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Description 1"
          required
        />
      </div>

      <div class="form-group">
        <label>Description 2</label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Description 2"
          required
        />
      </div>

      <div class="form-group">
        <label>Description 3 <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Description 3"
          required
        />
      </div>

      <div class="form-group">
        <label>Unit <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Unit"
          required
        />
      </div>

      <div class="form-group"></div>

      <label class="titleHeader">Unit Type Input : </label><br />
      <hr />
      <br />

      <div class="special-group">
        <label>Type A1 <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Type A1"
          required
        />
      </div>

      <div class="special-group">
        <label>Type E1 <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Type E1"
          required
        />
      </div>

      <div class="special-group">
        <label>Type C1 <span style="color: red">***</span></label>
        <input
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Type C1"
          required
        />
      </div>
    </form>
  </md-card-content>
</template>

<style scoped>
hr {
  border: none;
  height: 2px;
  background-color: transparent;
  width: 100%;
  margin: -6px 0;
}
/* Adjust form layout */
.form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Add space between form elements */
}

.form-group,
.special-group {
  flex: 0 0 calc(50% - 10px); /* Two columns, adjust width as needed */
  margin-bottom: 30px;
}

.special-group {
  flex: 0 0 calc(33.33% - 10px); /* Three columns, adjust width as needed */
}

.form-control {
  border: none;
  border-bottom: 1px solid #ccc; /* Add bottom border for inputs */
  width: 100%;
  padding: 8px 0; /* Add padding to input */
  box-sizing: border-box; /* Include padding in width */
}

label {
  font-weight: 100 !important;
}

@media (max-width: 768px) {
  .form-group,
  .special-group {
    flex: 0 0 calc(100% - 10px); /* Full width on smaller screens */
  }
}
</style>
