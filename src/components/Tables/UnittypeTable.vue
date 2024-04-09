<template>
  <md-card-content>
    <form>
      <div v-for="(module, index) in modules" :key="index">
      <div class="form-group">
        <label><b>Unit Type:</b></label>
        <input
        v-model="module.name"
          type="text"
          class="form-control"
          placeholder="Enter Unit Type"
          required
        />
      </div>

      <div class="form-group">
        <label><b>Unit Type Quantity:</b></label>
        <input
        v-model="module.quantity"
          type="text"
          class="form-control"
          placeholder="Enter Unit Type Quantity"
          required
        />
      </div>

      <div class="form-group">
        <label><b>ADJ Factor:</b></label>
        <input
        v-model="module.adjFactor"
          type="text"
          class="form-control"
          placeholder="Enter ADJ Factor"
          required
        />
      </div>
      </div>
    </form>
    <button type="submit" class="btn-save" @click="addUnit">Updated</button><br /><br />
  </md-card-content>
</template>

<script>
export default {
  data() {
    return {
      modules: [{ name: '', quantity: '', adjFactor: '' }]
    };
  },
  methods: {
    addUnit() {
      const formDataUnit = { ...this.modules[0] }; 
      this.$emit('form-unit', formDataUnit); 
    }
   
  },
};
</script>

