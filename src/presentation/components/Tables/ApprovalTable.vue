<template>
  <div class="table-container" >
    <table class="custom-table">
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
  overflow-x: auto;
  height: 98%;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.custom-table th,
.custom-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.custom-table th {
  background-color: #f2f2f2;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.custom-table tbody tr:hover {
  background-color: #ddd;
}

.input-text {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-button {
  position: absolute;
  bottom: 20px;
  right: 0px;
  padding: 8px 16px;
  background-color: orange;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}

.save-button:hover {
  background-color: orange;
}
</style>
