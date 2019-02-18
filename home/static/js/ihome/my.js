function logout() {
    $.get("/user/logout/", function(data){
        if (data.code == '200') {
            location.href = "/home/index/";
        }
    })
}

$(document).ready(function(){
    $.ajax({
        url:'/user/user_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
           $('#user-name').html(data.data.name)
           $('#user-mobile').html(data.data.phone)
           $('#user-avatar').attr('src','/static/media/'+data.data.avatar)
           if(data.data.id_card){
            $('#auth1 span').html('已实名认证')
           }
        }
    })
})