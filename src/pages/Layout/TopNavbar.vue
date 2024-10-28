<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        

        <div class="md-collapse">
          <md-list>
            <md-list-item href="projectList">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Project List</p>
            </md-list-item>

            <li class="md-list-item">
              <div class="md-list-item-content">
                <drop-down>
                  <md-button
                    slot="title"
                    class="md-button md-just-icon md-simple"
                    data-toggle="dropdown"
                  >
                    <md-icon>notifications</md-icon>
                    <span class="notification">{{ todayNotifications.length }}</span>
                    <p class="hidden-lg hidden-md">ProjectList</p>
                  </md-button>
                  <ul class="dropdown-menu dropdown-menu-right">
                    <!-- Notification Header -->
                    <div class="notification-header">
                      <span style="font-size: 14px !important; color: orange;"><b>Notification</b></span>
                    </div>
                    <li v-if="todayNotifications.length === 0">
                      <div class="notification-item">
                        <p>No notifications</p>
                      </div>
                    </li>
                    <li v-else v-for="notification in todayNotifications.slice(0, 5)" :key="notification.id">
                      <div class="notification-item" @click="handleNotificationClick(notification)">
                        <i class="material-icons notification-icon" style="margin-top: 7px;">{{ getNotificationIcon(notification.category) }}</i>
                        <div class="notification-content">
                          <md-icon style="color: red; font-size: 12px !important;">circle</md-icon><strong style="font-size: 10px;">{{ notification.title }}</strong>
                          <p style="font-size: 12px">{{ notification.description }}</p>
                        </div>
                        <div class="notification-time">
                          {{ formatRelativeDate(notification.createdAt) }}
                        </div>
                      </div>
                    </li>
                    <!-- View All Notifications -->
                    <li class="view-all">
                      <md-button @click="viewAllNotifications" class="md-raised md-primary" style="background-color: #fef4e4 !important;font-size: 10px !important;font-weight: 600;color: black;">
                        Show All Notifications
                      </md-button>
                    </li>
                  </ul>
                </drop-down>
              </div>
            </li>

            <li class="md-list-item">
              <div class="md-list-item-content">
                <drop-down class="nav-item" menu-on-right>
                  <template #title>
                    <a href="#" class="nav-link pr-0" @click.prevent>
                      <span class="avatar avatar-sm rounded-circle">
                        <img alt="Image placeholder" src="@/assets/img/admin-logo.png" style="height: 32px;margin-right: 10px;">
                      </span>
                      <span class="mb-0 text-sm font-weight-bold ml-2 d-none d-lg-block">{{ username }}</span>
                    </a>
                  </template>
                  <ul class="dropdown-menu dropdown-menu-right" style="min-width: 192px !important;">
                    <!-- Notification Header -->
                    <div class="notification-header">
                      <span style="font-size: 14px !important; color: orange;"><b>Welcome to QAward !</b></span>
                    </div>
                    <li >
                      <div class="notification-item" @click="logout">
                        <md-icon class="mdIcon" style="margin-right: 10px;">directions_run</md-icon>
                        <span>Logout</span>
                      </div>
                    </li>
                  </ul>
                </drop-down>
              </div>
            </li>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>


<script>
import store from "@/services/axios/store";
import NotificationController from "@/services/controllers/NotificationController.js";
import { formatDistanceToNow } from 'date-fns'; 
import { enGB } from 'date-fns/locale'; 

export default {
  data() {
    return {
      todayNotifications: [], 
      username: '',
    };
  },
  async mounted() {
    this.username = localStorage.getItem('username') || 'Guest';

    try {
      const { data } = await NotificationController.notificationAccess();
      this.todayNotifications = data.filter(notification => !notification.is_read);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    logout() {
      store.dispatch("clearToken");
      this.$router.push("/logout");
    },
    getNotificationIcon(category) {
      switch (category) {
        case 'Approve':
          return 'library_add_check';
        case 'Reject':
          return 'cancel_schedule_send';
        default:
          return 'warning';
      }
    },
    formatRelativeDate(date) {
      const distance = formatDistanceToNow(new Date(date), { addSuffix: true, locale: enGB });
      return distance.replace('about', '').replace('years', 'y').replace('year', 'y')
                     .replace('months', 'm').replace('month', 'm')
                     .replace('days', 'd').replace('day', 'd')
                     .replace('hours', 'h').replace('hour', 'h')
                     .replace('minutes', 'm').replace('minute', 'm')
                     .trim();
    },
    viewAllNotifications() {
      window.open('/notification', '_blank');
    },
    async notificationRead() {
      try {
        const notificationIds = this.todayNotifications.slice(0, 5).map(notification => notification.id);
      
        const NotificationRead = { ids: notificationIds };
        const message = await NotificationController.updateRead(NotificationRead);

        this.todayNotifications = this.todayNotifications.filter(notification => !notificationIds.includes(notification.id));


      } catch (error) {
        console.error('Error updating notifications:', error);
      }
    },
    async handleNotificationClick(notification) {
      // Open the notification link in a new tab
      if (notification.link) {
        window.open(notification.link, '_blank');
      }
      
      // Mark the notification as read
      try {
        const NotificationRead = { ids: [notification.id] };
        await NotificationController.updateRead(NotificationRead);
        
        // Update local notifications list
        this.todayNotifications = this.todayNotifications.filter(notif => notif.id !== notification.id);
        
      } catch (error) {
        console.error('Error updating notifications:', error);
      }
    }
  },
};
</script>

<style scoped>
.adminLogo-styled-dropdown-menu {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  min-width: 200px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.adminLogo-dropdown-header {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.adminLogo-dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  font-size: 0.9rem;
  color: #555;
  transition: background-color 0.3s ease;
  border-radius: 6px;
}

.adminLogo-dropdown-item:hover {
  background-color: #f4f4f4;
  color: #333;
}

.adminLogo-icon {
  margin-right: 8px;
  font-size: 1.2rem;
  color: #888;
  transition: color 0.3s ease;
}

.adminLogo-dropdown-item:hover .adminLogo-icon {
  color: #333;
}

.adminLogo-divider {
  margin: 10px 0;
  border-top: 1px solid #e0e0e0;
}

.adminLogo-logout-item {
  color: #e63946;
  font-weight: bold;
}

.adminLogo-logout-item:hover {
  background-color: #fce4e4;
  color: #d32f2f;
}

</style>
