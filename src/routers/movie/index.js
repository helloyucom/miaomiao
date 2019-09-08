export default {
    path: '/movie',
    component: () => import('@/views/Movie'),
    // @ 表示src目录
    children: [
        {
            path: 'city',   // 不加 / 是相对路径
            component: ()=> import('@/components/City')
        },
        {
            path: 'nowPlaying',
            component: ()=> import('@/components/NowPlaying')
        },
        {
            path: 'comingSoon',
            component: ()=> import('@/components/ComingSoon')
        },
        {
            path: 'search',
            component: ()=> import('@/components/Search')
        },
        {
          path: 'detail/1/:movieId',
          components: {
            default: () => import('@/components/NowPlaying'),
            detail: () => import('@/views/Movie/detail')
          },
          props: {
            detail: true
          }
        },
        {
          path: 'detail/2/:movieId',
          components: {
            default: () => import('@/components/ComingSoon'),
            detail: () => import('@/views/Movie/detail')
          },
          props: {
            detail: true
          }
        },
        {
            path: '/movie',
            redirect: '/movie/nowPlaying'
        }
    ]
}
