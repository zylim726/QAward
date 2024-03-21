

// Import your components
import Login from "@/pages/Login.vue";
import Logout from "@/pages/Logout.vue";
import ProjectList from "@/pages/ProjectList.vue";
import Callquotation from "@/pages/Callquotation.vue";
import Comparison from "@/pages/Comparison.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Description from "@/pages/Description.vue";
import LATrade from "@/pages/Layout/LATrade.vue";
import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import ProjectControl from "@/pages/Layout/ProjectControl.vue";
import Revision from "@/pages/Layout/Revision.vue";
import Quotation from "@/pages/Layout/Quotation.vue";

// Define your routes
const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/projectlist",
    children: [
      { path: "projectlist", 
        name: "Project List", 
        component: ProjectList,
        meta: { requiresAuth: true },
      },

      { path: "callquotation", 
        name: "Call For Quotation", 
        component: Callquotation,
        meta: { requiresAuth: true },
       },

      { path: "comparison", 
        name: "Subcon Comparison", 
        component: Comparison,
        meta: { requiresAuth: true },
      },

      { path: "latrade", 
        component: LATrade,
        meta: { requiresAuth: true },
      },

      { path: "description", 
        name: "Create / Import Description",
        component: Description,
        meta: { requiresAuth: true },
      },

      { path: "revision", 
        name: "Revision", 
        component: Revision,
        meta: { requiresAuth: true },
      },
      
      { path: "user", 
        name: "User Profile", 
        component: UserProfile,
        meta: { requiresAuth: true },
      },

      { path: "projectcontrol", 
        name: "Project Control", 
        component: ProjectControl,
        meta: { requiresAuth: true },
      },

      { path: "quotation", 
        name: "Create / Import Quotation", 
        component: Quotation,
        meta: { requiresAuth: true },
      },

    ],
  },
  { path: "/login", 
    name: "Login", 
    component: Login,
  },
  { path: "/logout", 
    name: "Logout", 
    component: Logout,
  },
];







export default routes;
