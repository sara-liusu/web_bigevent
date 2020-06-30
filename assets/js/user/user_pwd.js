$(function () {

    var form = layui.form;
    var layer = layui.layer;

    // 1. 利用 form.verify() 来定义规则
    //   1.1 传入的参数是对象，属性值(定义的规则)可以是数组、回调函数
    // 2. 为密码框分别添加对应的校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        newPwd: function (value) {
            if (value === $('.layui-input [name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwwd: function (value) {
            if (value !== $('.layui-input [name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }
    })


    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        // 法1: 在前端传入服务器的数据中剔除掉rePwd,因为没有定义变量接收
        const inputParams = form.val('formUserPwd');
        delete inputParams.rePwd;

        // 法2: 参数的组装,只要 oldPwd newPwd
        // let params = $(this).serialize().split('&');
        // params.length = 2; // 取前两个 params.length = 0,清空数组 

        // 法3: 在后端加上rePwd变量

        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: inputParams,
            // data: params.join('&'),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新密码失败');
                    // return layer.msg(res.message);
                }
                layer.msg('更新密码成功！');

                // jq对象转dom对象 重置表单
                $('.layui-form')[0].reset();
                // console.log($('.layui-form'));


            }
        })
    })
})