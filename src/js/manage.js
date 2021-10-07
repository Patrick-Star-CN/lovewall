var userName;
var total;
$(document).ready(function(){  
    userName = window.location.search.split("=")[1]; //从 URL 获取 用户名
    getMyConfess(userName);
});
function getMyConfess(userName) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/manage",
        data: "user=" + userName, // GET请求发送字符串
        success: function(data) {
            total = data.content.length;
            for (i = 0; i < total; i++){
                var ele = document.createElement("div");
                ele.className = "note";
                ele.setAttribute("title", String(i));
                ele.innerHTML = "<span class='quote'>“</span><span class='sheet'>" + data.content[i] + "</span><div class='attach'><span class='check'>No." + data.id[i] + "</span><span class='object'>—— " + data.tidyName[i] + "</span></div><div class='tools'><button class='edit' onclick='edit(" + String(i) + ")'>编辑</button><button class='delect' onclick='delect(" + String(i) + ")'>删除</button></div>";
                document.getElementsByClassName("column")[i % 3].appendChild(ele); 
            }
        },
        error: function(jqXHR) {console.log("Error:" + jqXHR.status);}
    });
}
find = function(num) { //flex瀑布流打乱了 DOM 顺序，所以执行查询
    for (var i = 0; i < total; i++)
        if ($(".note")[i].getAttribute("title") == num) 
            return i;
}
function edit(num) {
    pos = find(num);
    var id = $(".check")[pos].innerHTML.split(".")[1];
    var content = $(".sheet")[pos].innerHTML;
    window.location.href="../add/?user=" + userName + "&id=" + id;
}
function delect(num) {
    pos = find(num);
    var id = $(".check")[pos].innerHTML.split(".")[1];
    alert(id);
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/delete_confess",
        data: "id=" + id, // GET请求发送字符串
        success: function(data) {
            if (data.back == "succeed"){
                alert("删除成功");
                window.location.reload();
            }
        },
        error: function(jqXHR) {console.log("Error:" + jqXHR.status);}
    });
}
function quit() {
    window.location.href="../../preview";
}
function toMain() {
    window.location.href="../../main/?user=" + userName;
}
function toAdd() {
    window.location.href="../add/?user=" + userName;
}