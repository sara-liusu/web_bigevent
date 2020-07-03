$(function () {
    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage

    // 定义美化时间的过滤器 
    // 通过 template.defaults.imports 定义过滤器
    template.defaults.imports.dataFormat = function (date) {
        let dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1); // 月份从0-11
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 定义补零的函数 
    function padZero(n) {
        return n > 9 ? n : '0' + n
    };

    // 定义一个查询的参数对象，将来请求数据的时候， 
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据（点击不同的页码值，给其重新赋值）  告诉服务器要的是第几页数据
        pagesize: 2, // 告诉服务器每页显示几条数据，默认每页显示2条  
        cate_id: '', // 筛选条件：文章分类的 Id  
        state: '' // 文章的发布状态 
    }

    // 这个函数调用必须在上面，获取文章分类的数据，然后将文章分类的数据赋值给artCateList
    initCate();

    initTable();

    var artCateList;

    // ⭐获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'Get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                const { status, message, total } = res;
                if (status !== 0) {
                    return layui.layer.msg(res.message);
                }

                // 需要给数组添加额外的cate_name 属性
                res.data.forEach(item => {
                    // find 去数组找一个符合条件的某一项
                    const article = artCateList.find(cate => cate.Id === item.cate_id);
                    if (article) {
                        // 给item添加cate_name属性
                        item.cate_name = article.name;
                    }
                });

                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // ⭐初始化文章分类(请求文章分类)
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                artCateList = res.data;
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 通过 layui 重新渲染表单区域的UI结构 （内部机制导致的）
                form.render();
            }
        })


    }

    // 筛选功能——绑定表单的submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        // 获取表单中选中项的值
        // cate_id 所属分类的id,state 文章状态
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;

        // q.pagenum = 1 本来应该加这一步，让搜索查询一直从1开始
        // 根据最新的筛选条件，重新获取表格的文章列表数据
        initTable();
    })

    // 定义渲染分页的方法
    // 1. 定义一个用于存放分页的容器
    // 2. 从layui导出一个laypage对象，调用 laypage.render() 方法
    function renderPage(total) {

        console.log(total);

        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum,  // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 选择每页展示多少条

            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调 =>first是undefined
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调 =>first是true
            jump: function (obj, first) {
                // debugger
                // 方法：可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的；否则就是方式1触发的
                // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable();
                }
            }

        })

    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    // 不能通过给按钮直接添加id  绑定点击事件，循环创建会产生很多同一个id的按钮
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len)
        // 获取到文章的 id （删除按钮添加自定义属性）
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})