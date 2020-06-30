$(function () {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();
    var layer = layui.layer;

    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // console.log('ok');
        // 提示用户是否确认登录
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //点击确认做的事（执行回调函数）
            // 1. 清除本地存储中的 token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html';

            // 关闭 confirm 询问框
            layer.close(index);
        }, function () {
            // 点击取消做的事

        });

    })

})

function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        headers: {
            Authorization: localStorage.getItem('token') || '',
        },
        success: function (res) {
            // console.log(res);
            if (res.status) {
                // return layer.msg('获取用户信息失败');
                return layer.msg(res.message);
            }

            // 调用 renderAvater 渲染用户的头像
            renderAvater(res.data);

        },
        // 请求失败执行的回调函数
        // error: function (error) {
        //     console.log('失败回调');

        // },
        // 无论成功还是失败，最终都会调用complete 函数
        complete: function (res) {
            // console.log('执行了complete回调');
            // console.log(res);

            // 在complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败') {
                // 1. 强制清空 token
                localStorage.removeItem('token');

                // 2. 强制跳转到登录页面
                location.href = '/login.html';
            }
        }

    })
}

// 渲染用户的头像
function renderAvater(user) {
    // 1. 获取用户名称
    var name = user.nickname || user.username;

    // 2. 设置欢迎的文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);

    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片的头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();

    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show();

    }
}


// function ajax() {
//     $.ajax({
//         type: 'get',
//         url: '/api/xxinfo',
//         success: function (res) {
//             console.log(res)
//         },
//         error: function (error) {
//             console.log(er)
//         },
//         complete: function () {
//             console.log('不管你请求成功还是失败，这个回调都会执行；执行时间在success或者error之后')
//         }
//     })
// }