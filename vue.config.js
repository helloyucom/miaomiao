module.exports =  {
    devServer: {
        proxy: {
            '/api' : {
                // 代理的目标
                target: 'http://39.97.33.178',
                // 代理的时候是否改变反向代理的地址
                changeOrigin: true
            }
        }
    }
}