window.onload = function() {
    
    getMyConfess(getDataFromURL());
    $("#userName").html(getDataFromURL());
}
var getDataFromURL = function() {
    var data = window.location.search; //从 URL 获取 用户名
    return data.split("=")[1];
}

function getMyConfess(userName) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/main",
        data: "user=" + userName, // GET请求发送字符串
        success: function(data) {
            for (var i = 1; i <= 9; i++){ //用户自己发表的表白要 pin 在墙头
                console.log(data.content[i] + " " + data.tidyName[i]); //test
            }
        },
        error: function(jqXHR) {console.log("Error:" + jqXHR.status);}
    });
}

function toSheetManger() {
    window.location.href="../userManger/?user=" + $("#userName").html();
}