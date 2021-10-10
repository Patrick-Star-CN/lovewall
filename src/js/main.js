var userName, myTidyName;

$(document).ready(function () {
    $("#userName").html(getDataFromURL());
    if (userName == undefined) {
        alert("非法访问！");
        window.location.href = "/";
        return;
    }
    else if (userName == "undefined") {
        alert("你的手速太快了，请重新登录！");
        window.location.href = "/";
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
        url: "http://81.69.253.122:1234/main",
        data: "user=" + userName, // GET请求发送字符串
        success: function (data) {
            var ele1 = $(".sheet");
            var ele2 = $(".object");
            var ele3 = $(".check");
            myTidyName = data.myTidyName;
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
    $("#commentContent").val("");
    $("#submitInfo span")[0].innerHTML = "用户名：" + userName;
    $("#submitInfo span")[1].innerHTML = "你姓名的英文缩写：" + myTidyName;
    var confessid = $(".check")[num].innerHTML.split(".")[1];
    /*  后端处理评论的工作量太大了，于是放弃这块的数据传输了
        $.ajax({
        type: "GET",
        url: "http://localhost:8080/manage_comment",
        data: "confessid=" + confessid, // GET请求发送字符串
        success: function (data) {
            var ele = $("#publicContainer");
            ele.html("");
            for (var i = 1; i <= data.content.length; i++){
                ele.prepend("<div class='each_comment'><div class='commtentInfo'><span class='commentTidyName'>" + data.tidyName[i - 1] + "</span><span><a>" + String(i) + "楼</a><a>回复</a></span></div><div class='content'><p>" + data.content[i - 1] + "</p></div></div>");
            }
            console.log(data.content + " " + data.tidyName);
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    }); */
}
function submitComment() {
    var content = $("#commentContent").val();
    var id = $("#preview-check").html().split(".")[1];
    var data = {};
    data.tidyName = myTidyName;
    data.content = content;
    data.userName = userName;
    data.uid = id;
    /* $.ajax({
        type: "POST",
        url: "http://localhost:8080/send_comment",
        data: JSON.stringify(data),
        success: function (data) { alert("发送成功！"); }, //根据后端返回判断是否发送成功
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    }) */
}
function toAdd() {
    window.location.href = "/userManager/add/?user=" + $("#userName").html();
}
function quit() {
    window.location.href = "/";
}
function closeComment() {
    $("#cover").css("display", "none");
    $("#container").css("display", "none");
}