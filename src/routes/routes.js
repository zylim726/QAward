import DashboardLayout from "@/presentation/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/presentation/pages/Dashboard.vue";
import UserProfile from "@/presentation/pages/UserProfile.vue";
import TableList from "@/presentation/pages/TableList.vue";
import Typography from "@/presentation/pages/Typography.vue";
import Icons from "@/presentation/pages/Icons.vue";

import Notifications from "@/presentation/pages/Notifications.vue";


import Login from "@/presentation/pages/Login.vue";
import SummaryComparison from "@/presentation/pages/SummaryComparison.vue";
import Comparison from "@/presentation/pages/Comparison.vue";




const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/summarycomparison",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
      },
      {
        path: "table",
        name: "Table List",
        component: TableList,
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography,
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
      },
      {
        path: "summarycomparison",
        name: "Summary Comparison",
        component: SummaryComparison,
      },
      {
        path: "comparison",
        name: "Comparison",
        component: Comparison,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

export default routes;
