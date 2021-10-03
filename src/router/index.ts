import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { auth, getCurrentUser } from "./../main";

const routes: Array<RouteRecordRaw> = [
  {
    name:"home",
    path: '/',
    component: () => import ('../views/Home.vue'),
    meta:{haveSideBar:true,requiresAuth:true}
  },
  {
    path: '/login',
    component: () => import ('../views/Login.vue')
  },
  {
    path: '/signup',
    component: () => import ('../views/Signup.vue')
  },
  {
    path: '/select-payment-plan',
    component: () => import ('../views/SelectPaymentPlan.vue'),
    meta:{requiresAuth:true}
  },
  {
    path: '/shops',
    component: () => import ('../views/shops/Index.vue'),
    meta:{haveSideBar:true,requiresAuth:true}
  },
  {
    path: '/shops/new',
    component: () => import ('../views/shops/New.vue'),
    meta:{requiresAuth:true}
  },
  {
    path: '/products',
    component: () => import ('../views/products/Index.vue'),
    meta:{haveSideBar:true,requiresAuth:true}
  },
  {
    path: '/products/new',
    component: () => import ('../views/products/New.vue'),
    meta:{requiresAuth:true}
  },
  {
    path: '/products/:sku',
    component: () => import ('../views/products/Edit.vue'),
    meta:{requiresAuth:true}
  },
  {
    path: '/production-products',
    component: () => import ('../views/productionCapicity/Index.vue'),
    meta:{haveSideBar:true,requiresAuth:true}
  },
  {
    path: '/production-products/new',
    component: () => import ('../views/productionCapicity/New.vue'),
    meta:{haveSideBar:true,requiresAuth:true}
  },
  {
    path: '/customers',
    component: () => import ('../views/customers/Index.vue'),
    meta:{haveSideBar:true,requiresAuth:true}
  },
  {
    path: '/customers/new',
    component: () => import ('../views/customers/New.vue'),
    meta:{requiresAuth:true}
  },
  {
    path: '/customers/:id',
    component: () => import ('../views/customers/Edit.vue'),
    meta:{requiresAuth:true}
  },
  {
    path: '/ledger',
    component: () => import ('../views/ledger/Index.vue'),
    meta:{haveSideBar:true,requiresAuth:true}
  },
  {
    path: '/ledger/new',
    component: () => import ('../views/ledger/New.vue'),
    meta:{requiresAuth:true}
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach(async (to,from,next)=>{
  const user = await getCurrentUser;
  if(to.meta.requiresAuth && !user){
    router.push("/login");
  }
  next();
});

export default router
