function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
//    var mySwiper = new Swiper ('.swiper-container', {
//        loop: true,
//        autoplay: 2000,
//        autoplayDisableOnInteraction: false,
//        pagination: '.swiper-pagination',
//        paginationType: 'fraction'
//    })
    $(".book-house").show();

})

$.get('/home/detail/',function(data){
    var search = document.location.search
    id = search.split('=')[1]
    $.ajax({
        url: '/home/detail/' + id + '/',
        dataType: 'json',
        type:'GET',
        success: function(data){
            console.log(data);
            if(data.code == '200'){
                for(var index in data.data.images){
                    var imgNode = $('<img>').attr('src',data.data.images[index])
                    var liNode = $('<li class="swiper-slide"></li>')
                    liNode.append(imgNode)
                    $('.swiper-wrapper').append(liNode)
                };
                var mySwiper = new Swiper ('.swiper-container', {
                    loop: true,
                    autoplay: 2000,
                    autoplayDisableOnInteraction: false,
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction'
                })
                $('.house-price span').html(data.data.price);
                $('.house-title').html(data.data.title);
                $('.landlord-pic img').attr('src','/static/media/'+data.data.user_avatar)
                $('.landlord-name span').html(data.data.user_name);
                $('.house-info-list li').html(data.data.address);

                h3Node = $('<p>'+'出租'+data.data.room_count+'间'+'</p>');
                pNode = $('<p>房屋面积:'+data.data.acreage+'平米</p> ');
                p1Node = $('<p>房屋户型:'+data.data.unit+'</p> ');
                divNode = $('<div class="icon-text"></div>');
                divNode.append(h3Node);
                divNode.append(pNode);
                divNode.append(p1Node);
                spanNode = $('<span class="icon-house"></span>');
                $('#info1').append(spanNode);
                $('#info1').append(divNode);
                $('#person h3').html('宜住'+data.data.capacity+'人');
                $('#bed11').html(data.data.beds);
                var spanNode = $('<span>'+data.data.deposit+'</span>')
                var li1Node = $('<li>收取押金</li>')
                li1Node.append(spanNode)
                var spanNode = $('<span>'+data.data.min_days+'</span>')
                var li2Node = $('<li>最少入住天数</li>')
                li2Node.append(spanNode)
                var spanNode = $('<span>'+data.data.max_days+'</span>')
                var li3Node = $('<li>最多入住天数</li>')
                li3Node.append(spanNode)
                $('#info33').append(li1Node)
                $('#info33').append(li2Node)
                $('#info33').append(li3Node)
                for(var index in data.data.facilities){
                    var facility = data.data.facilities[index]
                    var span1Node = $('<span ></span>').attr('class',facility.css)
                    var span2Node = $('<span ></span>').html(facility.name)
                    var liNode = $('<li></li>')
                    liNode.append(span1Node)
                    liNode.append(span2Node)
                    $('.house-facility-list').append(liNode)
                }
                url = '/home/booking/?house_id='+data.data.id
                $('#booking1').attr('href',url)
            };
            if(data.code == '1001'){
                for(var index in data.data.images){
                    var imgNode = $('<img>').attr('src',data.data.images[index])
                    var liNode = $('<li class="swiper-slide"></li>')
                    liNode.append(imgNode)
                    $('.swiper-wrapper').append(liNode)
                };
                var mySwiper = new Swiper ('.swiper-container', {
                    loop: true,
                    autoplay: 2000,
                    autoplayDisableOnInteraction: false,
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction'
                })
                $('.house-price span').html(data.data.price);
                $('.house-title').html(data.data.title);
                $('.landlord-pic img').attr('src','/static/media/'+data.data.user_avatar)
                $('.landlord-name span').html(data.data.user_name);
                $('.house-info-list li').html(data.data.address);

                h3Node = $('<p>'+'出租'+data.data.room_count+'间'+'</p>');
                pNode = $('<p>房屋面积:'+data.data.acreage+'平米</p> ');
                p1Node = $('<p>房屋户型:'+data.data.unit+'</p> ');
                divNode = $('<div class="icon-text"></div>');
                divNode.append(h3Node);
                divNode.append(pNode);
                divNode.append(p1Node);
                spanNode = $('<span class="icon-house"></span>');
                $('#info1').append(spanNode);
                $('#info1').append(divNode);
                $('#person h3').html('宜住'+data.data.capacity+'人');
                $('#bed11').html(data.data.beds);
                var spanNode = $('<span>'+data.data.deposit+'</span>')
                var li1Node = $('<li>收取押金</li>')
                li1Node.append(spanNode)
                var spanNode = $('<span>'+data.data.min_days+'</span>')
                var li2Node = $('<li>最少入住天数</li>')
                li2Node.append(spanNode)
                var spanNode = $('<span>'+data.data.max_days+'</span>')
                var li3Node = $('<li>最多入住天数</li>')
                li3Node.append(spanNode)
                $('#info33').append(li1Node)
                $('#info33').append(li2Node)
                $('#info33').append(li3Node)
                for(var index in data.data.facilities){
                    var facility = data.data.facilities[index]
                    var span1Node = $('<span ></span>').attr('class',facility.css)
                    var span2Node = $('<span ></span>').html(facility.name)
                    var liNode = $('<li></li>')
                    liNode.append(span1Node)
                    liNode.append(span2Node)
                    $('.house-facility-list').append(liNode)
                }
                url = '/home/booking/?house_id='+data.data.id
                $('#booking1').attr('href',url)
                $('#booking1').hide()
            }
        },
        error: function(data){
            alert('失败了')
        },
    })
})
