// Import your pages
import Login from "@/pages/Login.vue";
import Logout from "@/pages/Logout.vue";
import Maintenance from "@/pages/Maintenance.vue";
import ProjectList from "@/pages/ProjectList.vue";
import Callquotation from "@/pages/Callquotation.vue";
import ApproveComparison from "@/pages/ApproveComparison.vue";
import LaWoSummaryList from "@/pages/LaWoSummaryList.vue";
import Comparison from "@/pages/Comparison.vue";
import UserConfig from "@/pages/UserConfig.vue";
import AccessPermission from "@/pages/AccessPermission.vue";
import Subcon from "@/pages/Subcon.vue";
import ProjectSetup from "@/pages/ProjectSetup.vue";

//IMPORT LAYOUT
import Createcq from "@/pages/Layout/Createcq.vue";
import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import ProjectControl from "@/pages/Layout/ProjectControl.vue";
import Revision from "@/pages/Layout/Revision.vue";
import Quotation from "@/pages/Layout/Quotation.vue";
import EditQuotation from "@/pages/Layout/EditQuotation.vue";
import Description from "@/pages/Layout/Description.vue";
import Remeasurement from "@/pages/Layout/Remeasurement.vue";
import Notification from "@/pages/Layout/Notification.vue";
import Features from "@/pages/Layout/Features.vue";
import Nofound from "@/pages/Nofound.vue";
import Mygrid from "@/pages/Layout/Mygrid.vue";
const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/projectlist",
    children: [
      {
        path: "projectlist",
        name: "Project List",
        component: ProjectList,
        meta: { requiresAuth: true },
      },
      {
        path: "approveComparison",
        name: "LA / WO Summary List",
        component: ApproveComparison,
        meta: { requiresAuth: true },
      },

      {
        path: "laWoSummaryList",
        name: "LA / WO Details",
        component: LaWoSummaryList,
        meta: { requiresAuth: true },
      },

      {
        path: "approveComparison",
        name: "Approve Comparison",
        component: ApproveComparison,
        meta: { requiresAuth: true },
      },

      {
        path: "callquotation",
        name: "Comparison Summary",
        component: Callquotation,
        meta: { requiresAuth: true },
      },

      {
        path: "comparison",
        name: "Subcon Comparison",
        component: Comparison,
        meta: { requiresAuth: true },
      },

      { path: "createcq", component: Createcq, meta: { requiresAuth: true } },

      {
        path: "description",
        name: "Create / Import Description",
        component: Description,
        meta: { requiresAuth: true },
      },

      {
        path: "revision",
        name: "Revision",
        component: Revision,
        meta: { requiresAuth: true },
      },

      {
        path: "notification",
        name: "Notification",
        component: Notification,
        meta: { requiresAuth: true },
      },

      {
        path: "features",
        name: "Features Update",
        component: Features,
        meta: { requiresAuth: true },
      },
      
      {
        path: "userconfig",
        name: "User Access",
        component: UserConfig,
        meta: { requiresAuth: true },
      },

      {
        path: "accesspermission",
        name: "Access Permission",
        component: AccessPermission,
        meta: { requiresAuth: true },
      },

      {
        path: "projectcontrol",
        name: "Project Control",
        component: ProjectControl,
        meta: { requiresAuth: true },
      },

      {
        path: "quotation",
        name: "Create / Import Quotation",
        component: Quotation,
        meta: { requiresAuth: true },
      },

      {
        path: "editquotation",
        name: "Edit Quotation",
        component: EditQuotation,
        meta: { requiresAuth: true },
      },

      {
        path: "subcon",
        name: "Subcon List",
        component: Subcon,
        meta: { requiresAuth: true },
      },

      {
        path: "projectsetup",
        name: "Project Setup",
        component: ProjectSetup,
        meta: { requiresAuth: true },
      },

      {
        path: "remeasurement",
        name: "Edit Description",
        component: Remeasurement,
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/logout", name: "Logout", component: Logout },
  { path: "/maintenance", name: "Maintenance", component: Maintenance },
  { path: "/nofound", name: "No found", component: Nofound },
  { path: "/mygrid", name: "Mygrid", component: Mygrid },
];

export default routes;
