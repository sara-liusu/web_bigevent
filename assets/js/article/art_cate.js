$(function () {
    var form = layui.form;

    initArtCateList();
    // 1. 获取(数据库)文章分类的列表
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // template('tpl-table', res)--调用template 第一个参数模板的id 第二个参数必须是渲染的数据对象
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }


    // 2. 弹出层渲染 form 表单结构
    // 导入layer
    var layer = layui.layer;

    // 预先保存弹出层的索引，方便后面进行关闭的操作
    var indexAdd = null;
    // 为添加类别按钮 绑定点击事件，
    $('#btnAddCate').on('click', function () {
        // 通过 layer.open() 展示弹出层，并渲染弹出层的显示内容
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 通过content 属性指定内容(在弹出层显示的内容)
            content: $('#dialog-add').html()
        }) // 拿到的 索引 是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。 
    })

    // 3. 填写分类之后数据到数据库，然后从数据库获取分类再添加到列表中
    // 注意，我们这个按钮不是写死的，是弹框出来的时候动态生成的，所以我们通过事 件委派方式给表单绑定 submit 事件
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                initArtCateList();
                layer.msg('新增分类成功');

                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })


    // 4. 通过事件委托的形式，为编辑按钮 绑定点击事件
    var indexEdit = null;
    // 给body tbody都可以
    $('tbody').on('click', '.btn-edit', function () {
        // 渲染弹出层的显示内容，同时获取索引，用于关闭弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 通过content 属性指定内容
            // 反复利用添加分类的模板，避免直接写html标签的繁琐步骤
            content: $('#dialog-edit').html()
        })

        // 在展示编辑弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
        // ⭐根据 Id 获取文章分类数据
        let id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data);
            }
        })
    })

    // ⭐根据Id更新文章分类
    // 5. 通过代理的形式，为编辑分类的表单绑定 submit 事件
    // 不懂4、5步？？？？？？
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // let obj = {
        //     Id: cate-id,
        //     name: layui.form.val('form-edit').name,
        //     alias: layui.form.val('form-edit').alias,

        // }
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 根据索引，关闭对应的弹出层
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })


    // ⭐根据 Id 删除文章分类
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })


        });


    })


})