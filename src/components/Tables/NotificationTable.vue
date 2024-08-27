<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div v-if="loading" class="spinner-border" role="status">
        <span class="visually-hidden">   
        <button class="transparentButton" style="margin-right: 10px;cursor: default;">
          <md-icon style="color: red;margin-bottom:10px;">autorenew</md-icon>
        </button> Loading...</span>
      </div>
    <div class="container">
      <div class="search-container">
        <form class="Searchbar">
          <input
            type="hidden"
          />
        </form>
      </div>
      <div class="filter-container" style="margin-right: -10px;margin-top: 4px;">
        <button class="btn-save" @click="markAllAsRead" >
          Mark All as Read
        </button>
        </div>
    </div>
    <div class="table-container" style="max-height: 700px; overflow-y: auto;margin-top: 10px;">
      <table class="nested-table">
        <thead>
          <tr>
              <th>No</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
        </thead>
        <tbody>
          <tr 
              v-for="(notify, index) in notification" 
              :key="notify.id" 
              @click="handleNotificationClick(notify)" 
              class="notification-row"
              style="cursor: pointer;"
          >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="tableNotification" >
                  <i class="material-icons read-icons" :style="{ color: getIconColor(notify.is_read) }">
                    {{ getNotificationIcon(notify.category) }}
                  </i>
                  <div class="tableNotifyContent">
                    <p style="font-size: 11px !important;margin: 0px;"><b>{{ notify.title }}</b></p>
                    <p class="tableNotifyDiescription">{{ notify.description }}</p>
                    <p style="font-size: 11px !important;">created by : {{ notify.created_by }}</p>
                  </div>
                </div>
              </td>
              <td>{{ formatRelativeDate(notify.updatedAt) }}</td>
            </tr>
        </tbody>
      </table>
      <br />
    </div>
    </div>
</template>

<script>
import NotificationController from "@/services/controllers/NotificationController.js";
import { formatDistanceToNow } from 'date-fns'; 
import { enGB } from 'date-fns/locale'; 

export default {
  data() {
    return {
      notification: [],
      FailMessage: null,
      UpdateMessage: null, 
      loading: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await NotificationController.notificationAccess();
        this.notification = data; 
        console.log('data',data);
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || 'Unknown Data.'}`;
      } finally {
        this.loading = false;
      }
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
    getIconColor(isRead) {
      return isRead ? 'grey' : 'orange'; 
    },
    formatRelativeDate(date) {
      const distance = formatDistanceToNow(new Date(date), { addSuffix: true, locale: enGB });
      return distance.replace('about', '')
                     .replace('years', 'y').replace('year', 'y')
                     .replace('months', 'm').replace('month', 'm')
                     .replace('days', 'd').replace('day', 'd')
                     .replace('hours', 'h').replace('hour', 'h')
                     .replace('minutes', 'm').replace('minute', 'm')
                     .trim();
    },
    async markAllAsRead() {
      try {
        const unreadNotifications = this.notification.filter(notify => !notify.is_read);
        const notificationIds = unreadNotifications.map(notification => notification.id);
      
        const NotificationRead = { ids: notificationIds };
        await NotificationController.updateRead(NotificationRead);
        this.UpdateMessage = 'All notifications marked as read.';
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        this.FailMessage = `Error: ${error}`;
      }
    },
    async handleNotificationClick(notify) {
      if (notify.link) {
        window.open(notify.link, '_blank');
      }
      
      try {
        const NotificationRead = { ids: [notify.id] };
        await NotificationController.updateRead(NotificationRead);
        
        // Update local notifications list
        this.notification = this.notification.map(notification => 
          notification.id === notify.id ? { ...notification, is_read: true } : notification
        );
      } catch (error) {
        console.error('Error updating notifications:', error);
      }
    }
  },
};
</script>



<style scoped>
.tableNotification {
  display: flex; 
  align-items: flex-start;
}

.read-icons {
  margin-right: 15px; 
  font-size: 29px; 
}

.tableNotifyContent {
  display: flex;
  flex-direction: column; 
}

.tableNotifyDiescription {
  font-size: 15px;
  margin: 0; 
}

.notification-row:hover {
  background-color: #f5f5f5; 
}
</style>

