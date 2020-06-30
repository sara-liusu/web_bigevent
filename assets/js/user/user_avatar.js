$(function () {
    // 1. 实现基本裁剪效果
    //   1.1 获取裁剪区域的 DOM 元素 
    //   1.2 配置选项: 纵横比、指定预览区域 
    const options = {
        // 裁剪区域的纵横比  长:宽 = 1 是正方形, 16/9 是长方形
        aspectRatio: 1,
        // 指定预览区域(裁剪区选定的图片将在哪里显示)
        preview: '.img-preview'
    }
    //   1.3 创建裁剪区域
    $('#image').cropper(options);


    // 2. 用户点击按钮,手动触发 文件选择框的点击事件
    $('#btnChooseImage').on('click', function () {
        // 模拟用户点击
        $('#file').click();
    })

    // 3. 更换裁剪区域的图片
    //   3.1 为文件选择框绑定 change 事件
    // 当用户选择了某张图片的时候,自动触发change事件
    $('#file').on('change', function (e) {
        // 3.2 获取用户选择的文件
        // console.log(e);
        // target 指的是当前的目标元素-- input(id ='file')框 (input#file)
        var filelist = e.target.files; // 是个伪数组--选择文件的列表
        if (filelist.length === 0) {
            // var layer = layui.layer;
            return layui.layer.msg('请选择照片');
        }

        // 3.3 拿到了用户选择的文件
        var file = e.target.files[0];
        // 3.4 将文件 转化为路径 (创建一个对应的URL地址)
        // URL.createObjectURL 原生js方法
        var imgURL = URL.createObjectURL(file);
        // 3.5 重新初始化裁剪区域
        $('#image').cropper('destroy')  // 销毁旧的裁剪区
            .attr('src', imgURL)        // 重新设置图片路径
            .cropper(options)           // 重新初始化裁剪区域
    })


    // 4. 确定按钮绑定点击事件
    $('#btnConfir').on('click', function () {
        // 4.1 拿到用户裁剪的头像 输出的是 base64格式的图片
        var dataURL = $('#image').cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 4.2 调用接口 将裁剪后的头像上传到服务器上
        // 发起新头像的请求
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar', // 这里简写需要导入 baseAPI文件
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败!')
                }
                layui.layer.msg('更新头像成功!');

                // 再重新获取用户信息,渲染用户的头像
                window.parent.getUserInfo();
            }
        })
    })





})