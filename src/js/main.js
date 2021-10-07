var userName;

$(document).ready(function () {
    $("#userName").html(getDataFromURL());
    if (userName == undefined) {
        alert("非法访问！");
        window.location.href = "../../preview";
        return;
    }
    else if (userName == "undefined") {
        alert("你的手速太快了，请重新登录！");
        window.location.href = "../../preview";
        return;
    }
    getMessConfess();
});
function getDataFromURL() {
    userName = window.location.search.split("=")[1]; //从 URL 获取 用户名
    return userName
}
function getMessConfess() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/main",
        data: "user=" + userName, // GET请求发送字符串
        success: function (data) {
            var ele1 = $(".sheet");
            var ele2 = $(".object");
            var ele3 = $(".check");
            for (var i = 1; i <= 9; i++) { //用户自己发表的表白要 pin 在墙头
                ele1[i - 1].innerHTML = data.content[i];
                ele2[i - 1].innerHTML = "—— " + data.tidyName[i];
                ele3[i - 1].innerHTML = "No." + data.id[i];
            }
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    });
}
function comment(num) {
    // 评论区初始化
    $("#cover").css("display", "block");
    $("#container").css("display", "block");
    $("#preview-sheet").html($(".sheet")[num].innerHTML);
    $("#preview-check").html($(".check")[num].innerHTML);
    $("#preview-object").html($(".object")[num].innerHTML);
    /* var confessid = $(".check")[num].innerHTML.split(".")[1];
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/manage_comment",
        data: "confessid=" + confessid, // GET请求发送字符串
        success: function (data) {
            console.log(data.conmtent + " " + data.tidyName);
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    }); */
}
function toAdd() {
    window.location.href = "../userManger/add/?user=" + $("#userName").html();
}
function quit() {
    window.location.href = "../../preview";
}
function closeComment() {
    $("#cover").css("display", "none");
    $("#container").css("display", "none");
}