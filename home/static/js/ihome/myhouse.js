$(document).ready(function(){
    $(".auth-warn").show();
    $("#houses-list").hide();
    $.ajax({
        url:'/user/user_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if(data.data.id_card){
                $('.auth-warn').hide();
                $('#houses-list').show();
            };
        },
    });

    $.ajax({
        url: '/home/myhouse_about/',
        dataType: 'json',
        type: 'GET',
        success:function(data){
            if(data.code == '200'){
                for(var index in data.data){
                    var house = data.data[index]
                    var ulNode = $('<ul></ul>')
                    var liNode = $('<li>'+'位于：'+ house.area + '</li>')
                    ulNode.append(liNode)
                    var liNode = $('<li>'+'价格：'+ '￥' + house.price + '/晚' + '</li>')
                    ulNode.append(liNode)
                    var liNode = $('<li>'+'发布时间：'+ house.create_time + '</li>')
                    ulNode.append(liNode)
                    var divNode = $('<div class="house-text"></div>')
                    divNode.append(ulNode)
                    var imgNode = $('<img/>').attr('src',house.image)
                    var div1Node = $('<div class="house-content"></div>')
                    div1Node.append(imgNode)
                    div1Node.append(divNode)
                    var div2Node = $('<div class="house-title"></div>')
                    var h3Node = $('<h3>房屋ID:' + house.id + ' —— '+house.title + '</h3>')
                    div2Node.append(h3Node)
                    url = '/home/detail/?house_id='+house.id
                    var aNode = $('<a></a>').attr('href',url)
                    aNode.append(div2Node)
                    aNode.append(div1Node)
                    var liNode = $('<li></li>')
                    liNode.append(aNode)
                    $('#houses-list').append(liNode)
                }
            }
        }
    })
})

