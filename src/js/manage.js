var userName;
var total;
$(document).ready(function () {
    userName = window.location.search.split("=")[1]; //从 URL 获取 用户名
    if (userName == undefined) {
        alert("非法访问！");
        window.location.href = "../../preview/";
        return;
    }
    else if (userName == "undefined") {
        alert("你的手速太快了，请重新登录！");
        window.location.href = "../../preview/";
        return;
    }
    $("#userName").html(userName);
    getMyConfess(userName);
});
function getMyConfess(userName) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/manage",
        data: "user=" + userName, // GET请求发送字符串
        success: function (data) {
            total = data.content.length;
            if (total > 0)
                for (i = 0; i < total; i++) {
                    var ele = document.createElement("div");
                    ele.className = "note mdui-card";
                    ele.setAttribute("title", String(i));
                    ele.innerHTML = "<span class='quote'>“</span><span class='sheet'>" + data.content[i] + "</span><div class='attach'><span class='check'>No." + data.id[i] + "</span><span class='object'>—— " + data.tidyName[i] + "</span></div><div class='tools mdui-btn-group'><button class='edit mdui-btn mdui-btn-dense mdui-ripple' onclick='edit(" + String(i) + ")'><i class='mdui-icon material-icons'>edit</i></button><button class='delect mdui-btn mdui-btn-dense mdui-ripple' onclick='delect(" + String(i) + ")'><i class='mdui-icon material-icons'>delete</i></button></div>";
                    document.getElementsByClassName("column")[i % 3].appendChild(ele);
                }
            else {
                $("#internal").html("<h3>你还没发表过表白哦~，点击左上角发表吧！</h3>")
            }
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    });
}
find = function (num) { //flex瀑布流打乱了 DOM 顺序，所以执行查询
    for (var i = 0; i < total; i++)
        if ($(".note")[i].getAttribute("title") == num)
            return i;
}
function edit(num) {
    pos = find(num);
    var id = $(".check")[pos].innerHTML.split(".")[1];
    var content = $(".sheet")[pos].innerHTML;
    window.location.href = "../add/?user=" + userName + "&id=" + id;
}
function delect(num) {
    var confirm = window.confirm("确定要删除这条评论吗？");
    if (confirm == true) {
        pos = find(num);
        var id = $(".check")[pos].innerHTML.split(".")[1];
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/delete_confess",
            data: "id=" + id, // GET请求发送字符串
            success: function (data) {
                if (data.back == "succeed") {
                    alert("删除成功");
                    window.location.reload();
                }
            },
            error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
        });
    }
    else return;

}
function quit() {
    window.location.href = "../../preview/";
}
function toMain() {
    window.location.href = "../../main/?user=" + userName;
}
function toAdd() {
    window.location.href = "../add/?user=" + userName;
}