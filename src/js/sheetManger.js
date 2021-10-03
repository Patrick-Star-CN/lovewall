var display = new Vue ({
    el: "#workArea",
    data: {
        content: '',
        object: ''
    },
    methods: {
        writeContent:function(e){
            this.content = e.target.value
        },
        writeObject:function(e){
            this.object = "—— " + e.target.value
        }
    }
})
function submit() {
    var content = $("#content").val();
    var tidyName = $("#tidyName").val();
    
    var patrn2 = /^[A-Z]{1,5}$/; //缩写合法检测
    if (!patrn2.exec(tidyName)) $(".advice")[1].style.color = "red";
    else $(".advice")[1].style.color = "gray";
}