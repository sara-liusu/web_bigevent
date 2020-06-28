$(function () {
    $('#link_reg').on('click', function () {
        // 点击‘区注册账号’的链接
        $('.login-box').hide();
        $('.reg-box').show();
    })

    $('#link_login').on('click', function () {
        // 点击‘去登录’的链接
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从layui中获取form对象
    // 引入layui的js文件就可以有form
    // console.log(layui);
    var form = layui.form
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿密码框中的内容
            // 然后进行一次等于的判断即可
            var pwd = $('.reg-box [name=password]').val();

            if (pwd !== value) {
                return '两次密码不一致';
            }
        }

        // 自定义校验规则的步骤：
        // 1. 引入layui的js文件
        // 2. 定义form对象
        // 3. 通过form.verify()函数自定义校验规则
        // 4. 在input表单中给lay-verify添加对应属性值
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1. 阻止默认的提交行为
        e.preventDefault();
        // 2. 发送Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }

        $.post('/api/regUser', data, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                // 使用layer.msg之前导入layer
                return layer.msg(res.message);
            }
            // console.log('注册成功');
            layer.msg('注册成功,请登录！');
            // 模拟人的点击行为
            $('#link_login').click();
        })


        // $.ajax({
        //     type: 'post',
        //     url: 'http://127.0.0.1:3007/api/regUser',
        //     data: {
        //         username: $('#form_reg[name=username]').val(),
        //         password: $('#form_reg[name=password]').val()
        //     },
        //     success: function (res) {
        //         if (res.status !== 0) {
        //             return console.log(res.message);
        //         }
        //         console.log('注册成功');
        //     }
        // })

    })

    // 监听登陆表单的提交请求
    $('#form_login').on('submit', function (e) {
        // console.dir(this)
        // debugger
        // 箭头函数里面是没有this，往上一级作用域里查找

        // 1. 阻止默认的提交行为
        e.preventDefault();
        // 2. 提交Ajax的POST请求
        // 在用jquery发ajax请求之前，其实先调用了jQuery.ajaxPrefilter()函数
        $.ajax({
            type: 'post',
            // 将http://127.0.0.1:3007 根路径提取出来，统一管理
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                // const {status,message,token} = res;解构
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                layer.msg('登录成功!');
                // console.log(res.token);

                // 将登录成功得到的token字符串，保存到localStorage 中
                // localStorage 持久化存储的地方
                // const token = localStorage.getItem('token')--获取token字符串
                localStorage.setItem('token', res.token);

                // 跳转到后台主页
                location.href = '/index.html';

            }
        })
    })
})







