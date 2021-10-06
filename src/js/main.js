var userName;

$(document).ready(function(){  
    getMessConfess(getDataFromURL());
    $("#userName").html(getDataFromURL());
}); 
var getDataFromURL = function() {
    userName = window.location.search.split("=")[1]; //从 URL 获取 用户名
    return userName;
}
function getMessConfess(userName) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/main",
        data: "user=" + userName, // GET请求发送字符串
        success: function(data) {
            var ele1 = $(".sheet");
            var ele2 = $(".object");
            var ele3 = $(".check");
            for (var i = 1; i <= 9; i++){ //用户自己发表的表白要 pin 在墙头
                ele1[i - 1].innerHTML = data.content[i];
                ele2[i - 1].innerHTML = "—— " + data.tidyName[i];
                ele3[i - 1].innerHTML = "No." + data.id[i];
                //console.log(data.content[i] + " " + data.tidyName[i]); //test
            }
        },
        error: function(jqXHR) {console.log("Error:" + jqXHR.status);}
    });
}
function toAdd() {
    window.location.href="../userManger/add/?user=" + $("#userName").html();
}