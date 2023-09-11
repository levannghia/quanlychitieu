// import { useUserStore } from "src/stores/user-store"

const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'email-confirmation', name: 'email-confirmation', component: () => import('pages/EmailConfirmationPage.vue') }
    ]
  },
  {
    path: '/',
    // beforeEnter: (to, from, next) => {
    //   useUserStore().id ? next() : next('/auth/login')
    // },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: '/note-create', name: 'note.create', component: () => import('src/pages/NoteCreatePage.vue') },
      { path: '/note-edit/:id', name: 'note.edit', component: () => import('src/pages/NoteEditPage.vue') },
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/category',
    component: () => import('layouts/CategoryLayout.vue'),
    children: [
      { path: '', name: 'category.index', component: () => import('src/pages/CategoryPage.vue') },
      { path: 'create', name: 'category.create', component: () => import('src/pages/CategoryCreatePage.vue') },
      { path: 'chart', name: 'category.chart', component: () => import('src/pages/ChartPage.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
