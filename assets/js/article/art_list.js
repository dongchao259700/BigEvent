$(function () {
    var layer = layui.layer;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    refreshWeb();
    initCate();


    //获取文章列表
    function refreshWeb() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('art-list', res);
                $('tbody').html(htmlStr)
                renderPage(res.total);
            }
        })
    }

    //时间过滤器
    template.defaults.imports.time = function (date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());
        var h = addZero(dt.getHours());
        var mi = addZero(dt.getMinutes());
        var s = addZero(dt.getSeconds());

        return y + '/' + m + '/' + d + '' + h + ':' + mi + ':' + s
    }
    //时间补零函数
    function addZero(n) {
        return n < 10 ? '0' + n : n;
    }
    var form = layui.form;

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //编辑文章列表事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        // console.log(q.cate_id);
        // console.log(q.status);
        refreshWeb()
    })

    //分页方法
    var laypage = layui.laypage;

    function renderPage(total) {
        laypage.render({
            elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    refreshWeb()
                }
            }
        })
    }
})