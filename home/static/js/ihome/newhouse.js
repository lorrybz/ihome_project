function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url:'/home/home_area/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if(data.code == '200'){
                for(var index in data.data){
                    var area = data.data[index];
                    var optionNode = $('<option>'+area.name+'</option>').attr('value',area.id)
                    $('#area-id').append(optionNode)
                }
            }
        }
    });
    $.ajax({
        url:'/home/home_fac/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if(data.code == '200'){
                for(var index in data.data){
                    var fac = data.data[index];
                    var inputNode = $('<input type="checkbox" name="facility">').attr('value',fac.id)
                    var lableNode = $('<label></label>')
                    lableNode.append(inputNode)
                    var spanNode = $('<span>'+fac.name+'</span>')
                    lableNode.append(spanNode)
                    var divNode = $('<div class="checkbox"></div>')
                    divNode.append(lableNode)
                    var liNode = $('<li></li>')
                    liNode.append(divNode)
                    $('.house-facility-list').append(liNode)
                }
            }
        }
    })

    $('#form-house-info').submit(function (e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/home/newhouse/',
            dataType:'json',
            type:'POST',
            success:function(data){
                console.log(data)
                if(data.code == '1001'){
                    $('.text-center span').html(data.msg);
                    $(".text-center").show();
                };
                if(data.code == '200'){
                    $('#form-house-info').hide()
                    $('#form-house-image').show()
                    $('#house-id').attr('value',data.data)
                }
             },
            error:function(data){
                alert('请求失败')
            }
        });
    });

    $('#form-house-image').submit(function (e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/home/house_image/',
            dataType:'json',
            type:'POST',
            success:function(data){
                if(data.code == '1001'){
                    $('#err11 span').html(data.msg);
                    $("#err11").show();
                };
                if(data.code == '200'){
                    console.log(data)
                    var imgNode = $('<img/>').attr('src',data.data)
                    $('#form-house-image').prepend(imgNode)
                };
             },
            error:function(data){
                alert('请求失败')
            }
        });
    })
});



