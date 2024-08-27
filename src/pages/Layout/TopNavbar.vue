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

            <md-list-item @click="logout">
              <i class="material-icons">logout</i>
              <p class="hidden-lg hidden-md">Logout</p>
            </md-list-item>
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
    };
  },
  async mounted() {
    try {
      const { data } = await NotificationController.notificationAccess();
      this.todayNotifications = data.filter(notification => !notification.is_read);
      console.log('this notification',this.todayNotifications);
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
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  border-bottom: 1px solid orange; 
}

.mark-as-read {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.mark-as-read md-icon {
  margin-right: 5px;
  font-size: 18px; 
}


.notification-item {
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 14px;
  color: #555;
}

.notification-item p {
  margin: 0;
}

.notification-item:hover {
  background-color: #fef4e4;
}

.notification-icon {
  margin-right: 10px;
  color: orange;
  align-self: flex-start;
  font-size: 20px; 
}

.notification-content {
  flex: 1;
  font-size: 14px;
}

.notification-time {
  font-size: 12px;
  color: #9E9E9E;
}

.view-all {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.view-all md-button {
  width: 100%; /* Make the button full-width */
  text-align: center;
}
</style>
