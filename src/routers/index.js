import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Movie from './movie'
import Cinema from './cinema'
import Mine from './mine'

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        Movie,
        Cinema,
        Mine,
        {
            path: '/*',
            redirect: '/movie'
        }
    ]
})
