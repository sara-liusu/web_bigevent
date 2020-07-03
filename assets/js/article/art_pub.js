$(function () {
    // 默认状 （定值 名称大写）
    const PUBLISHSTATE = '已发布';
    const DRAFTSTATE = '草稿';

    var form = layui.form;
    var layer = layui.layer;
    // 1. 定义 initCate 方法，请求文章类别的列表，利用模板引擎渲染到页面
    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }
                // 调用模板引擎，渲染分类的下拉菜单 
                // res->{} ，返回的是一个经过模板自行处理之后的字符串
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法

                form.render();
            }
        })
    }

    // 2. 初始化富文本编辑器
    initEditor();

    // 3. 实现基本裁剪效果
    // 3.1 初始化图片裁剪器
    var $image = $('#image')
    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.3 初始化裁剪区域
    $image.cropper(options)

    // 4. 选择封面按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5. 将选定的图片设置到裁剪区域
    // 监听 coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表伪数组
        var filelist = e.target.files;
        // 判断用户是否选择了文件
        if (filelist.length === 0) {
            // var layer = layui.layer;
            return layer.msg('请选择照片');
        }
        // 拿到了用户选择的文件，根据文件，创建对应的 URL 地址
        var file = e.target.files[0];
        var imgURL = URL.createObjectURL(file);

        // 为裁剪区重新设置图片
        $('#image').cropper('destroy')  // 销毁旧的裁剪区
            .attr('src', imgURL)        // 重新设置图片路径
            .cropper(options)           // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    let STATE = PUBLISHSTATE;
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#saveDraft').on('click', function () {
        // 记录用户的点击
        STATE = DRAFTSTATE;
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认行为
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个FormData 对象
        const formData = new FormData($(this)[0]);
        // 3. 将文章的发布状态添加，存到 formData 中。固定语法
        formData.append('state', STATE);

        // formData.forEach(function (v, k) {
        //     console.log(v, k); // 打印出来只有title cate_id content 没有state，则需要手动添加进去
        // })

        // 4. 将裁剪后的封面追加到 FormData对象中
        $image.cropper('getCroppedCanvas', {
            // 创建一个Canvas画布
            width: 400,
            height: 280
        }).toBlob(function (blob) { // 将Canvas画布上的内容，转化为一个文件对象
            // debugger
            // 5. 将文件对象，储存在formData中
            formData.append('cover_img', blob);
            // cover_img:(binary) 表示一个二进制的文件
            // 6. 发起ajax数据请求
            publishArticle(formData);
        })
    })

    // ⭐定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果是向服务器提交FormData 格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // 发布文章成功之后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})