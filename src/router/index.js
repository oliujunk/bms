import Vue from 'vue';
import VueRouter from 'vue-router';

const Container = () => import('@/views/Container.vue');
const Login = () => import('@/views/Login.vue');

const Edit = () => import('@/views/Edit.vue');
// const Edit = () => import('@/views/ProgramEdit.vue');
const Test = () => import('@/views/ProgramTest.vue');

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'container',
    redirect: '/edit',
    component: Container,
    children: [
      { path: '/edit', component: Edit },
      { path: '/test', component: Test },
    ],
    // beforeEnter: (to, from, next) => {
    //   const username = sessionStorage.getItem('username');
    //   if (!username) {
    //     next({ path: '/login' });
    //   } else {
    //     next();
    //   }
    // },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const username = sessionStorage.getItem('username');
      if (username) {
        next({ path: '/' });
      } else {
        next();
      }
    },
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
