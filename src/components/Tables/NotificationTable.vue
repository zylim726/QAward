<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div v-if="isLoading"><loading-modal /><br><br></div>
    <!-- Flex container to align the buttons -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      
      <!-- Back to Comparison Button (Left) -->
      <button @click="backToComparison" class="transparentButton" style="margin-left: 10px;">
        <div class="tooltip">
          <span class="tooltiptext" style="width: 160px; margin-left: -29px !important; margin-bottom: -105px;">
            Back to comparison pages.
          </span>
          <md-icon class="mdIcon">arrow_back_ios</md-icon>
        </div>
      </button>

      <!-- Mark All as Read Button (Right) -->
      <div class="filter-container" style="margin-right: -10px; margin-top: 4px;">
        <button class="btn-save" @click="markAllAsRead">
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
              <th></th>
            </tr>
        </thead>
        <tbody>
          <tr  v-for="(notify, index) in notification" :key="notify.id">
              <td>{{ index + 1 }}</td>
              <td class="notification-row" style="cursor: pointer;" @click="handleNotificationClick(notify)" >
                <div class="tableNotification" >
                  <i class="material-icons read-icons" :style="{ color: getIconColor(notify.is_read) }">
                    {{ getNotificationIcon(notify.category) }}
                  </i>
                  <div class="tableNotifyContent">
                    <p :style="[ { fontSize: '14px', margin: '0px' }]"><b>{{ notify.title }}</b></p>
                    <p class="tableNotifyDiescription" >{{ notify.description }}</p>
                  </div>
                </div>
              </td>
              <td>{{ formatRelativeDate(notify.createdAt) }}</td>
              <td v-if="notify.is_read">
                <button class="transparentButton" @click="markUnread(notify.id)">
                  <md-icon>bookmarks</md-icon>
                </button>
              </td>
              <td v-else>
                <md-icon style="color: orange;font-size: 16px !important;">circle</md-icon>
              </td>

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
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";
export default {
  components:{LoadingModal},
  data() {
    return {
      notification: [],
      FailMessage: null,
      UpdateMessage: null, 
      isLoading: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    backToComparison() {
      const id = this.$route.query.cqId;
      const storedProjectId = localStorage.getItem('projectId');
      this.$router.push({
        path: '/comparison',
        query: { cqID: id, projectID: storedProjectId }
      });
    },
    async loadData() {
      this.isLoading = true;
      try {
        const { data } = await NotificationController.notificationAccess();
        this.notification = data; 
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || 'Unknown Data.'}`;
      } finally {
        this.isLoading = false;
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
    },
    async markUnread(notificationId) {
      try {
        const NotificationUnread = { ids: [notificationId] };
        await NotificationController.updateUnRead(NotificationUnread);

        this.notification = this.notification.map(notification => 
          notification.id === notificationId ? { ...notification, is_read: false } : notification
        );
      } catch (error) {
        this.FailMessage = `Error: ${error.message || 'Unknown error.'}`;
      }
    },
  },
};
</script>


