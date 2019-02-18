var cur_page = 1; // 当前页
var next_page = 1; // 下一页
var total_page = 1;  // 总页数
var house_data_querying = true;   // 是否正在向后台获取数据

// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

// 更新用户点选的筛选条件
function updateFilterDateDisplay() {
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var $filterDateTitle = $(".filter-title-bar>.filter-title").eq(0).children("span").eq(0);
    if (startDate) {
        var text = startDate.substr(5) + "/" + endDate.substr(5);
        $filterDateTitle.html(text);
    } else {
        $filterDateTitle.html("入住日期");
    }
}


// 更新房源列表信息
// action表示从后端请求的数据在前端的展示方式
// 默认采用追加方式
// action=renew 代表页面数据清空从新展示
function updateHouseData(action) {
    $('.house-list').empty()
    var areaId = $(".filter-area>li.active").attr("area-id");
    if (undefined == areaId) areaId = "";
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sortKey = $(".filter-sort>li.active").attr("sort-key");
    var params = {
        aid:areaId,
        sd:startDate,
        ed:endDate,
        sk:sortKey,
        p:next_page
    };
    //发起ajax请求，获取数据，并显示在模板中
    $.ajax({
        url: '/home/search_update/',
        dataType: 'json',
        type: 'GET',
        data: params,
        success: function(data){
            if(data.code == '200'){
                for(var index in data.data){
                    var house = data.data[index]
                    span1Node = $('<span class="house-title">'+ house.title +'</span>')
                    emNode = $('<em>出租'+ house.room_count +'间'+ '一次入住'+ house.address +'</em>')
                    div1Node = $('<div class="house-intro"></div>')
                    div1Node.append(span1Node)
                    div1Node.append(emNode)

                    span2Node = $('<span>'+'￥'+house.price+'/晚'+'</span>')
                    div2Node = $('<div class="house-price"></div>')
                    div2Node.append(span2Node)

                    imgNode = $('<img>').attr('src',"/static/media/"+house.user_avatar)
                    div3Node = $('<div class="landlord-pic"></div>')
                    div3Node.append(imgNode)
                    div4Node = $('<div class="house-desc"></div>')
                    div4Node.append(div1Node)
                    div4Node.append(div2Node)
                    div4Node.append(div3Node)

                    imgNode = $('<img>').attr('src',house.images[0])
                    url = '/home/detail/?house_id='+house.id
                    a1Node = $('<a></a>').attr('href',url)
                    a1Node.append(imgNode)

                    liNode = $('<li class="house-item"></li>')
                    liNode.append(a1Node)
                    liNode.append(div4Node)
                    $('.house-list').append(liNode)
                }
            }
        }
    })
}



//            <li class="house-item">
//                <a href="/detail.html?id=1"><img src="/static/images/home01.jpg"></a>
//                <div class="house-desc">
//                    <div class="landlord-pic"><img src="/static/images/landlord01.jgp"></div>
//                    <div class="house-price">￥<span>200</span>/晚</div>
//                    <div class="house-intro">
//                        <span class="house-title">房屋标题1</span>
//                        <em>出租6间 - 1次入住 - 中关村软件园</em>
//                    </div>
//                </div>
//            </li>


$(document).ready(function(){
    var queryData = decodeQuery();
    var startDate = queryData["sd"];
    var endDate = queryData["ed"];
    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
    updateFilterDateDisplay();
    var areaName = queryData["aname"];
    if (!areaName) areaName = "位置区域";
    $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html(areaName);

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    var $filterItem = $(".filter-item-bar>.filter-item");
    $(".filter-title-bar").on("click", ".filter-title", function(e){
        var index = $(this).index();
        if (!$filterItem.eq(index).hasClass("active")) {
            $(this).children("span").children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            $(this).siblings(".filter-title").children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).addClass("active").siblings(".filter-item").removeClass("active");
            $(".display-mask").show();
        } else {
            $(this).children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).removeClass('active');
            $(".display-mask").hide();
            updateFilterDateDisplay();
        }
    });
    $(".display-mask").on("click", function(e) {
        $(this).hide();
        $filterItem.removeClass('active');
        updateFilterDateDisplay();
        cur_page = 1;
        next_page = 1;
        total_page = 1;
        updateHouseData("renew");

    });
    $(".filter-item-bar>.filter-area").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html($(this).html());
        } else {
            $(this).removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html("位置区域");
        }
    });
    $(".filter-item-bar>.filter-sort").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(2).children("span").eq(0).html($(this).html());
        }
    })
})

$(document).ready(function(){


    $.ajax({
        url:'/home/index_info/',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            console.log(data)
            if(data.code == '200'){
                for(var index in data.data){
                    var area = data.data[index]
                    liNode = $('<li area-id="' + area.id +'">' + area.name + '</li>')
                    $('.filter-area').append(liNode)
                }
            }
        },
    });
    var search = document.location.search
    aa = search.split('=')[1]
    id = aa.split('&')[0]
    $.ajax({
        url: '/home/search_update1/',
        dataType: 'json',
        type: 'GET',
        data: {'id':id},
        success: function(data){
            if(data.code == '200'){
                for(var index in data.data){
                    var house = data.data[index]
                    span1Node = $('<span class="house-title">'+ house.title +'</span>')
                    emNode = $('<em>出租'+ house.room_count +'间'+ '一次入住'+ house.address +'</em>')
                    div1Node = $('<div class="house-intro"></div>')
                    div1Node.append(span1Node)
                    div1Node.append(emNode)

                    span2Node = $('<span>'+'￥'+house.price+'/晚'+'</span>')
                    div2Node = $('<div class="house-price"></div>')
                    div2Node.append(span2Node)

                    imgNode = $('<img>').attr('src',"/static/images/"+house.user_avatar)
                    div3Node = $('<div class="landlord-pic"></div>')
                    div3Node.append(imgNode)
                    div4Node = $('<div class="house-desc"></div>')
                    div4Node.append(div1Node)
                    div4Node.append(div2Node)
                    div4Node.append(div3Node)

                    imgNode = $('<img>').attr('src',house.images[0])
                    url = '/home/detail/?house_id='+house.id
                    a1Node = $('<a></a>').attr('href',url)
                    a1Node.append(imgNode)

                    liNode = $('<li class="house-item"></li>')
                    liNode.append(a1Node)
                    liNode.append(div4Node)
                    $('.house-list').append(liNode)
                }
            }
        }
    })
})


