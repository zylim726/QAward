import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Login from "@/pages/Login.vue";
import SummaryComparison from "@/pages/SummaryComparison.vue";
import Comparison from "@/pages/Comparison.vue";
import Trade from "@/pages/Trade.vue";



const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/summarycomparison",
    children: [
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
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
      {
        path: "trade",
        name: "Trade List",
        component: Trade,
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
