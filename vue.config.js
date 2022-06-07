module.exports = {
    baseUrl: './',
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 8080,//它是用来修改你打开后的端口号的
        open: true,//值为 true的话，项目启动时自动打开到浏览器里边， false不会打开
        proxy:{
            '':{
                target:'http://192.168.26.12:9600',
                changeOrigin:true,
            } 
        }
    }
}