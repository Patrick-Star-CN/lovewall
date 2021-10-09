var data = {};

function submit(check) {
    if (check == 1) //注册
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/sign_up",
            //url: "http://172.20.10.3:8080/sign_up",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.back == "succeed") { alert("注册成功！"); window.location.href = "../signin/"; }
                else if (data.back == "fail") { alert("用户名已被注册！"); location.reload(); }
                else { alert("未知错误..."); location.reload(); }
            }, //根据后端返回判断是否注册成功
            error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
        })
    else if (check == 2) { // 登录
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/sign_in",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.back == "succeed") {
                    alert("登录成功！");
                    window.location.href = "../main/?user=" + $("#userName").val(); //传输用户数据
                }
                else if (data.back == "unsigned") { alert("该用户还未注册！"); location.reload(); }
                else if (data.back == "worsePassword") { alert("用户名或密码错误！"); }
                else { alert("未知错误..."); location.reload(); }
            }, //根据后端返回判断是否登录成功
            error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
        })
    }
}
function sign_up() { //注册
    var userName = $("#userName").val();
    var tidyName = $("#tidyName").val();
    var password1 = $("#pass1").val();
    var password2 = $("#pass2").val();

    var patrn1 = /^(\w){1,20}$/; //用户名合法检测
    if (!patrn1.exec(userName)) $(".advice")[0].style.color = "red";
    else $(".advice")[0].style.color = "gray";

    var patrn2 = /^[A-Z]{1,5}$/; //缩写合法检测
    if (!patrn2.exec(tidyName)) $(".advice")[1].style.color = "red";
    else $(".advice")[1].style.color = "gray";

    if (password1.length >= 8 && password1.length <= 14) { //密码合法检测
        $(".advice")[2].style.color = "gray";
        if (password1 == password2 && patrn1.exec(userName) && patrn2.exec(tidyName)) { //确认密码合法检测
            $(".advice")[3].style.color = "gray";
            if (userName == "undefined"){
                alert("请使用其他用户名注册");
                return;
            }
            data = {};
            data.userName = userName;
            data.tidyName = tidyName;
            data.password = md5(password1); // 因为加密了，原密码格式不受限
            submit(1);
        }
        else {
            $(".advice")[3].style.color = "red";
        }
    }
    else {
        $(".advice")[2].style.color = "red";
    }
}
function sign_in() { //登录
    var userName = $("#userName").val();
    var password = $("#pass").val();
    if (userName == "") $(".advice")[0].style.color = "red";
    else $(".advice")[0].style.color = "gray";

    if (password == "") $(".advice")[1].style.color = "red";
    else $(".advice")[0].style.color = "gray";

    if (userName != "" && password != "") {
        data = {};
        data.userName = userName;
        data.password = md5(password);
        submit(2);
    }

}