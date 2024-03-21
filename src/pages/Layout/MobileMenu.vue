<template>
  <ul class="nav nav-mobile-menu">
    <li>
      <a href="#" class="dropdown-toggle" data-toggle="dropdown">
        <i class="material-icons">dashboard</i>
        <p>Dashboard</p></a
      >
    </li>
    <li>
      <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
        <i class="material-icons">notifications</i>
        <span class="notification">5</span>
        <p>Notifications</p>
      </a>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      selectedEmployee: null,
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone",
      ],
    };
  },
};
</script>
