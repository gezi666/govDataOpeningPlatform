/**
 * Created by guohuimin on 2017/10/25.
 */
$(document).ready(function () {

    User.loginTF(); //判断用户是否登录

    //序号+1
    Handlebars.registerHelper("addOne", function (index) {
        //返回+1之后的结果
        return index + 1;
    });

    //判断是否
    Handlebars.registerHelper('whether', function (i) {
        if (i == "1") {
            return '是'
        } else {
            return '否'
        }
    })

    //判断数据项列表奇偶行
    Handlebars.registerHelper('isEven', function (i) {
        if (i % 2 == 0) {
            return ''
        } else {
            return 'even'
        }
    })

    //处理空值
    Handlebars.registerHelper("handleEmpty", function (txt, replaceTxt) {
        if (!txt || txt == "") {
            return replaceTxt;
        } else {
            return txt
        }
    });

    //翻译共享方式
    Handlebars.registerHelper("handleSharedMode", function (modeCode) {
        if (modeCode == '5') {
            return '邮件或介质'
        } else if (modeCode == '6') {
            return '接口'
        } else if (modeCode == '7') {
            return '数据库'
        } else if (modeCode == '8') {
            return '文件'
        } else if (modeCode == '10') {
            return '无'
        } else {
            return '--'
        }
    });

    $(document).on('click', function (e) {
        $(".head-login-dis").stop().removeClass("head-login-show").slideUp();
    });
    $('.head-login-dis').on('click', function (e) {
        e.stopPropagation();
    });
    $('.head-login-txt').on('click', function (e) {
        e.stopPropagation();
    });
    $(".head-login-txt").click(function () {
        if ($(".head-login-dis").hasClass("head-login-show")) {
            $(".head-login-dis").stop().removeClass("head-login-show").slideUp();
        } else {
            User.loginVef(); //获取验证码
            $(".head-login-dis").stop().addClass("head-login-show").slideDown();
        }
    })
});
function keyLogin() {
    if(event.keyCode ==13){
        User.loginConfirm()
    }
}
//走后台服务器接口
// var servicePath = "//192.168.1.67:8010";
var servicePath = "//202.106.10.250:8024/gov-platform";
api = {
    get: function (url, data) {
        return this.send("get", url, data);
    },
    post: function (url, data) {
        return this.send("post", url, data);
    },
    send: function (type, url, data) {
        if (!data) data = {};  //兼容IE8
        var dtd = $.Deferred();
        data.key = Math.random();
        $.ajax({
            url: servicePath + url,
            type: type,
            data: data,
        }).then(function (data) {
            dtd.resolve(data);
        }, function (error) {
            console.log("提交失败", "操作失败");
            dtd.reject();
        });
        return dtd.promise();
    }
};

tool = {
    // Handlebars渲染列表数据
    renderList: function (domId, tempId, dataList) {
        //预编译模板
        var template = Handlebars.compile($(tempId).html());
        //输入模板
        $(domId).html(template(dataList));
    },
    getParams: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return decodeURI(r[2]);
        return null;
    },
    /*js 获取cookie*/
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    /*js 设置cookie*/
    setCookie: function (c_name, c_value) {
        //获取当前时间
        var date = new Date();
        var expiresDays = 1;
        //将date设置为1天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
        document.cookie = c_name + "=" + escape(c_value) + "; expires=" + date.toGMTString() + ";path=/";
    },
    /*删除cookies*/
    delCookie: function (c_name, c_value) {
        //获取当前时间
        var date = new Date();
        var expiresDays = -1;
        //将date设置为1天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
        document.cookie = c_name + "=" + escape(c_value) + "; expires=" + date.toGMTString() + ";path=/";
    },
    validatePhone: function (value) {
        return /^1[34578]\d{9}$/.test(value);
    },
    validateEmail: function (value) {
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value);
    }
}
User = {
    //获取验证码
    loginVef: function () {
        $("#verification-img").attr("src", servicePath + "/user/imageCode?num=" + Math.random());
    },
    //登录请求
    loginConfirm: function () {
        var urn = document.getElementById("userName").value;
        var pwd = document.getElementById("passWord").value;
        var vef = document.getElementById("verification").value;
        var loginSend = {
            "loginname": urn,
            "password": pwd,
            "imgcode": vef
        }
        if (urn == '') {
            $(".login-erroy").text('请输入用户名');
            setTimeout(function () {
                $(".login-erroy").empty();
            }, 3000)
        } else if (pwd == '') {
            $(".login-erroy").text('请输入密码');
            setTimeout(function () {
                $(".login-erroy").empty();
            }, 3000)
        } else if (vef == '') {
            $(".login-erroy").text('请输入验证码');
            setTimeout(function () {
                $(".login-erroy").empty();
            }, 3000)
        } else {

            api.post('/user/login', loginSend).done(function (res) {
                if (typeof(res) == 'string') {
                    res = $.parseJSON(res)
                }

                if (res.result == 1) {
                    var currUser = res.data[0];
                    currUser.loginname = loginSend.loginname;
                    currUser.loginpwd = loginSend.password;
                    tool.setCookie('currUser', JSON.stringify(currUser));
                    var pathname = window.location.pathname;
                    if (pathname.indexOf("/catalog/") != -1)
                        window.location.reload();
                    else {
                        $(".head-login").hide();
                        $(".head-user").show();
                        $(".head-login-dis").hide();
                        var customerId = res.data[0].username;//将数据中用户信息的ID赋值给变量
                        $(".head-username").text(customerId);
                    }
                } else {
                    $(".login-erroy").text(res.msg);
                    setTimeout(function () {
                        $(".login-erroy").empty();
                    }, 3000)
                    return false;
                }
            })
        }
    },
    //判断用户是否登录
    loginTF: function () {
        var currUser = tool.getCookie('currUser');
        if (currUser) {
            currUser = JSON.parse(currUser);
            $(".head-login").hide();
            $(".head-user").show();
            $(".head-username").text(currUser.username);

        } else {
            $(".head-login").show();
            $(".head-user").hide();
        }
    },
    //用户退出登录
    signOut: function () {
        api.get('/user/loginOut').done(function (res) {
            if (typeof(res) == 'string') {
                res = $.parseJSON(res)
            }
            if (res.result == 1) {
                tool.delCookie('currUser');
                User.refresh();
            }
        })
    },
    refresh: function () {
        var pathname = window.location.pathname;
        if (pathname.indexOf("/user/") > -1)
            location.href = "../index/index.html";
        else {
            $(".head-login").show();
            $(".head-user").hide();
        }
    },
    //获取当前登录用户
    getCurrUser: function () {
        var currUser = tool.getCookie('currUser');
        if (currUser) {
            currUser = JSON.parse(currUser);
            return currUser;
        }
        return null;
    }
}
