import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes : [
    {
      path: '/',
      name: 'signin',
      component: () => import('../views/SignIn.vue')
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('../views/SignIn.vue')
  
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/SignUp.vue')
  
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('../views/User.vue'),
      meta: {
        requiresAuth: true
      }
  
    },
    {
      path: '/latest',
      name: 'Latest',
      component: () => import('../views/LatestPosts.vue'),
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue'),
      meta: {
        isAdmin: true
      },
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
      next('/signin')
    } else {
      next()
    }
  },

  router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.isAdmin)) {
        if (store.getters.isAdmin == 1) {

            next();
            return;
        }
        console.log("not admin")
        next('/latest');

    } else {
        next();
    }
}));

export default router
