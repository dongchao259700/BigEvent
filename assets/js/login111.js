// 入口函数
$(function () {
    // 点击跳转登录/注册页面
    $('#a-one').on('click', function () {
        $('.loginBox').hide();
        $('.regBox').show();
    })
    $('#a-two').on('click', function () {
        $('.loginBox').show();
        $('.regBox').hide();
    })
    // 表单校验
    var form = layui.form;
    form.verify({
        // 校验密码格式
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码相同
        repwd: function (value) {
            var pwd = $('.regBox [name=password]').val();
            if (pwd !== value) {
                return "两次密码不一致,请重新输入"
            }
        }
    })
    // 监听提交注册事件
    var layer = layui.layer;
    $('#reg_form').on('submit', function (e) {
        e.preventDefault();
        var data = {
            username: $('#reg_form [name=username]').val(),
            password: $('#reg_form [name=password').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录');
            $("#a-two").click();
        })
    })
    // 监听提交登录事件
    $('#login_form').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})