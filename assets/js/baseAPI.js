// 注意：每次调用 $.get() 或 $.post() 的时候，会先调用ajaxPrefilter这个函数。在这个函数中，可以拿到我们给Ajax提供的配置对象
// ajaxPrefilter函数用于指定预先处理Ajax参数选项的会调函数
$.ajaxPrefilter(function (options) {
    // 在发送真正的Ajax之前，统一拼接请求的根路径
    // 统一添加请求的基准路径
    options.url = 'http://127.0.0.1:3007' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口，设置headers 请求头
    // options.url.indexOf('/my/') !== -1
    // indexOf('my')>=0 返回当前字符串所在的索引位置
    if (options.url.includes('/my')) {
        options.headers = {
            'Authorization': localStorage.getItem('token'),
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        console.log('执行了complete回调');
        console.log(res);

        // 在complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败') {
            // 1. 强制清空 token
            localStorage.removeItem('token');

            // 2. 强制跳转到登录页面
            location.href = '/login.html';
        }
    }
})