<template>
  <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
    <md-card>
      <md-card-content>
        <div class="custom-list">
          <ol>
            <li v-for="(item, index) in items" :key="index">
              <h3>{{ item.name }}</h3>
              <ul v-if="item.subItems && item.subItems.length">
                <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
                  {{ subItem }}
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { name: 'Coffee', subItems: ['123'] },
        { name: 'Tea', subItems: ['123', '123', '123'] },
        { name: 'Milk' }
      ]
    };
  }
};
</script>

<style scoped>
.custom-list {
  padding: 20px;
}

ol {
  list-style-type: decimal;
  margin-left: 20px;
}

ul {
  list-style-type: circle;
  margin-left: 20px;
}

li {
  margin-bottom: 5px;
}
</style>
