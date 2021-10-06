var userName;


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
            /* var box1 = $(".sheet");
            var box2 = $(".object");
            for (var i = 1; i <= 9; i++){ //用户自己发表的表白要 pin 在墙头
                box1[i - 1].innerHTML = data.content[i];
                box2[i - 1].innerHTML = "—— " + data.tidyName[i];
                
            } */
            for (i = 0; i < data.content.length; i++){
                
                //console.log(data.content[i] + " " + data.tidyName[i] + " " + data.id[i]); 
                var ele = "<div class='note'><span class='quote'>“</span><span id='sheet'>" + data.content[i] + "</span><div class='attach'><span class='check'>No." + data.id[i] + "</span><span class='object'>—— " + data.tidyName[i] + "</span></div><div id='tools'><button id='edit'>编辑</button><button id='delect'>删除</button></div></div>";
                $("#internal").append(ele);
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