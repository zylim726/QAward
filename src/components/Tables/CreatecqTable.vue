<template>
  <md-card-content>
    <form >
      <div  v-for="(module, index) in modules" :key="index">
      <div class="form-group">
        <label><b>Category:</b></label>
        <input
            v-model="module.tradeCategory"
            type="text"
            class="form-control"
            placeholder="Enter Category"
            required
        />
      </div>

      <div class="form-group">
        <label><b>Trade:</b></label>
        <input
          v-model="module.trade"
          type="text"
          class="form-control"
          placeholder="Enter Trade"
          required
        />
      </div>

      <div class="form-group">
        <label><b>Location 1:</b></label>
        <input
        v-model="module.location"
          type="text"
          class="form-control"
          step="0.01"
          placeholder="Enter Location 1"
          required
        />
      </div>

      <div class="form-group">
        <label><b>Actuall Calling Quotation Date:</b></label>
        <input  v-model="module.callingquotationDate" type="date" class="form-control" required />
      </div>

      <div class="form-group">
        <label><b>Awading Target Date:</b></label>
        <input type="date" v-model="module.awadingtaget" class="form-control" required />
      </div>

      <div class="form-group">
        <label><b>Remarks:</b></label>
        <input
          v-model="module.remarks"
          type="text"
          class="form-control"
          placeholder="Enter Remarks"
          required
        />
      </div>
      </div>
    </form>
    <button type="submit" class="btn-save" @click="addModule">Updated</button><br /><br />
    
  </md-card-content>
</template>


<script>

export default {
  data() {
    return {
      modules: [{ tradeCategory: '', trade: '', location: '', budgetAmount: '', callingquotationDate: '', awadingtaget: '', remarks: '' }]
    };
  },
  methods: {
    addModule() {
      const formData = { ...this.modules[0] }; 
      this.$emit('form-submitted', formData); 
    }
   
  },
};
</script>
