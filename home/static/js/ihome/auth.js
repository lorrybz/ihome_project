function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $.ajax({
        url:'/user/user_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if(data.code == '200'){
               $('#real-name').attr('value',data.data.id_name);
               $('#id-card').attr('value',data.data.id_card);
            }
            if(data.data.id_card){
                $('#save').hide()
                $('#real-name').attr('disabled','disabled')
                $('#id-card').attr('disabled','disabled')
            }
        }
    })
})



$(document).ready(function() {
    $("#form-auth").submit(function(e) {
        e.preventDefault();
        id_name = $("#real-name").val();
        id_card = $("#id-card").val();
//        异步提交注册请求，ajax
        $.ajax({
            url:'/user/auth/',
            type:'POST',
            dataType:'json',
            data:{'id_name': id_name, 'id_card': id_card},
            success:function(data){
                console.log(data)
                if(data.code == '200'){
                    $(location).attr('href','/user/my/')
                }
                if(data.code == '1001'){
                    $('#erro22 span').html(data.msg);
                    $("#erro22").show();
                }
                if(data.code == '1002'){
                    $('#erro22 span').html(data.msg);
                    $("#erro22").show();
                }

                if(data.code == '1003'){
                    $('#erro22 span').html(data.msg);
                    $("#erro22").show();
                }
            },
            error:function(data){
                alert('error')
            }
        })
    });
})