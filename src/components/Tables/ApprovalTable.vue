<template>
  <div class="table-container" >
    <table class="approval-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Remarks</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td><input type="text" v-model="user.name" class="input-text" /></td>
          <td><input type="text" v-model="user.remarks" class="input-text" /></td>
          <td><input type="text" v-model="user.date" class="input-text" /></td>
        </tr>
      </tbody>
    </table>
    <button class="save-button">Save</button>
  </div>
</template>

<script>
export default {
  name: "ordered-table",
  data() {
    return {
      users: [
        { id: 1, name: "Mr Lee", date: "2/1/2024", remarks: "good" },
        { id: 2, name: "Mr Khew", date: "2/1/2024", remarks: "good" },
        { id: 3, name: "Mr Chuah", date: "2/1/2024", remarks: "good" },
      ],
    };
  },
};
</script>

<style scoped>
.table-container {
  position: relative;
  height: 98%;
}

.input-text {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-button {
  bottom: 20px;
  right: 0px;
}
</style>
