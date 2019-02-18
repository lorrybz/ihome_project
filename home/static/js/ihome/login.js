function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function() {
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#password").focus(function(){
        $("#password-err").hide();
    });
    $(".form-login").submit(function(e){
        e.preventDefault();
        mobile = $("#mobile").val();
        passwd = $("#password").val();
        if (!mobile) {
            $("#mobile-err span").html("请填写正确的手机号！");
            $("#mobile-err").show();
            return;
        } 
        if (!passwd) {
            $("#password-err span").html("请填写密码!");
            $("#password-err").show();
            return;
        }

    $(".form-login").submit(function(e) {
        e.preventDefault();
        mobile = $("#mobile").val();
        passwd = $("#password").val();
//        异步提交注册请求，ajax
        $.ajax({
            url:'/user/login/',
            type:'POST',
            dataType:'json',
            data:{'mobile': mobile, 'passwd': passwd},
            success:function(data){
                console.log(data)
                if(data.code == '200'){
                    $(location).attr('href','/home/index/')
                }
                if(data.code == '1002'){
                    $('#mobile-err span').html(data.msg);
                    $("#mobile-err").show();
                }
                if(data.code == '1003'){
                    $('#mobile-err span').html(data.msg);
                    $("#mobile-err").show();
                }
                if(data.code == '1004'){
                    $('#password-err span').html(data.msg);
                    $("#password-err").show();
                }
                if(data.code == '1001'){
                    $('#password-err span').html(data.msg);
                    $("#password-err").show();
                }
            },
            error:function(data){
                alert('error')
            }
        })
    });
    });
})