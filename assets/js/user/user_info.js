$(function () {
    var form = layui.form;

    var layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (!new RegExp("/^[\S]{6,12}$/").test(value)) {
                return '昵称必须在1-6个字符';
            }
        }
    })


    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);

                // 调用form.val() 快速给表单进行赋值
                form.val('formUserInfo', res.data);
            }
        })
    }


    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        // console.log($(this).serialize()); {username:'',nickname:'',email:''}

        // ajax的数据请求
        const inputParams = form.val('formUserInfo');
        delete inputParams.username;

        // 发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            // 第二种方法：data: $(this).serialize(), 也会取到username,但是后端没有定义。可以在后端定义username，客户端全部获取
            // 第1种方法：
            data: inputParams,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);

                // 调用父页面的方法 重新渲染用户的头像和用户信息
                // 父元素身上所有属性和方法都能使用 window.parent
                // iframe 跨域
                window.parent.getUserInfo();
            }
        })
    })


})
