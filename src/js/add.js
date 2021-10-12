var data = {};
var userName, id;
var flag = false;
var display = new Vue({
    el: "#workArea",
    data: {
        content: '',
        object: ''
    },
    methods: {
    }
})

$(document).ready(function () {
    if (window.location.search.split("=")[1] == undefined) {
        alert("非法访问！");
        window.location.href = "/";
    }
    else if (window.location.search.split("=")[1] == "undefined") {
        alert("你的手速太快了，请重新登录！");
        window.location.href = "/";
    }
    else if (window.location.search.split("&")[1] == undefined) {
        flag = true; //添加模式
        userName = window.location.search.split("=")[1]; //从 URL 获取 用户名
        $("#userName").html(userName);
    }
    else { //编辑模式
        flag = false;
        userName = window.location.search.split("&")[0].split("=")[1];
        $("#userName").html(userName);
        $(".advice")[1].innerHTML = "编辑时禁止修改表白对象";
        $("#tidyName").attr("disabled", "disabled"); //禁止修改表白对象
        id = window.location.search.split("&")[1].split("=")[1];
        editLaunch(id);
    }
});
function submit() {
    var content = $("#content").val();
    var tidyName = $("#tidyName").val();
    var patrn = /^[A-Z]{1,5}$/; //缩写合法检测
    if (!patrn.exec(tidyName)) $(".advice")[1].style.color = "red";
    else $(".advice")[1].style.color = "gray";

    if (content == "") $(".advice")[0].style.color = "red";
    else $(".advice")[0].style.color = "gray";

    if (patrn.exec(tidyName) && content != "") {
        $(".advice")[1].style.color = "gray";
        content = content.replace(/[\r\n]/g, ""); //删除回车

        if (flag == true) {
            data.userName = userName;
            data.content = content;
            data.tidyName = tidyName;
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:8080/send_confess",
                data: JSON.stringify(data),
                success: function (data) { alert("添加成功！"); location.reload(); }, //根据后端返回判断是否发送成功
                error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
            })
        }
        else {
            data.contentnew = content;
            data.id = id;
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:8080/edit_confess",
                data: JSON.stringify(data),
                success: function (data) { alert("编辑成功！"); toManage(); }, //根据后端返回判断是否发送成功
                error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
            })
        }
    }
}
function editLaunch(id) {  //加载编辑模式
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/edit_confess",
        data: "id=" + id,
        success: function (data) {
            $("#content").val(data.content); //输入框 1
            $("#tidyName").val(data.tidyname); //输入框 2
            $(".object")[0].innerHTML = "—— " + data.tidyname;
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    });
}
function quit() {
    window.location.href = "/";
}
function toMain() {
    window.location.href = "/main/?user=" + userName;
}
function toManage() {
    window.location.href = "/userManager/manage/?user=" + userName;
}