//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function setStartDate() {
    var startDate = $("#start-date-input").val();
    if (startDate) {
        $(".search-btn").attr("start-date", startDate);
        $("#start-date-btn").html(startDate);
        $("#end-date").datepicker("destroy");
        $("#end-date-btn").html("离开日期");
        $("#end-date-input").val("");
        $(".search-btn").attr("end-date", "");
        $("#end-date").datepicker({
            language: "zh-CN",
            keyboardNavigation: false,
            startDate: startDate,
            format: "yyyy-mm-dd"
        });
        $("#end-date").on("changeDate", function() {
            $("#end-date-input").val(
                $(this).datepicker("getFormattedDate")
            );
        });
        $(".end-date").show();
    }
    $("#start-date-modal").modal("hide");
}

function setEndDate() {
    var endDate = $("#end-date-input").val();
    if (endDate) {
        $(".search-btn").attr("end-date", endDate);
        $("#end-date-btn").html(endDate);
    }
    $("#end-date-modal").modal("hide");
}

function goToSearchPage(th) {
    var url = "/home/search/?";
    url += ("aid=" + $(th).attr("area-id"));
    url += "&";
    var areaName = $(th).attr("area-name");
    if (undefined == areaName) areaName="";
    url += ("aname=" + areaName);
    url += "&";
    url += ("sd=" + $(th).attr("start-date"));
    url += "&";
    url += ("ed=" + $(th).attr("end-date"));
    location.href = url;
}

function is_user(){
    // 异步ajax,判断是否为登录用户
    $.ajax({
        url:'/home/is_user/',
        dataType: 'json',
        type: 'GET',
        success:function(data){
            if(data.code == '1001'){
                $('.register-login').hide();
                $('.user-info').show();
            }
            if(data.code == '1002'){
                $('.register-login').show();
                $('.user-info').hide();
            }
        }
    })
}

$(document).ready(function(){
    $(".top-bar>.register-login").show();
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);               //当窗口大小变化的时候
    $("#start-date").datepicker({
        language: "zh-CN",
        keyboardNavigation: false,
        startDate: "today",
        format: "yyyy-mm-dd"
    });
    $("#start-date").on("changeDate", function() {
        var date = $(this).datepicker("getFormattedDate");
        $("#start-date-input").val(date);
    });
    is_user()
//    登录后，显示登录用户


//    显示房子信息
    $.ajax({
        url:'/home/index_info/',
        dataType: 'json',
        type: 'GET',
        success:function(data){
            if(data.code == '200'){
//                房子
                for(index in data.info){
                    home = data.info[index]
//                    组装信息
                    home_info = '<a href="/home/detail/?house_id='+ home.id + '"><img src="' + home.image + '"></a>'
                    home_info += '<div class="slide-title"></div>'
                    var divNode = $('<div></div>').attr('class', 'swiper-slide')
                    divNode.html(home_info)
                    $('.swiper-wrapper').append(divNode)
                };
//                轮播
                var mySwiper = new Swiper ('.swiper-container', {
                    loop: true,
                    autoplay: 2000,
                    autoplayDisableOnInteraction: false,
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
//                区域
                for(index in data.data){
                    area = data.data[index]
                    // 组装参数
                    area_info = '<a href="#" area-id="' + area.id + '">' + area.name + '</a>'
                    $('.area-list').append(area_info)
                    $(".area-list a").click(function(e){
                        $("#area-btn").html($(this).html());
                        $(".search-btn").attr("area-id", $(this).attr("area-id"));
                        $(".search-btn").attr("area-name", $(this).html());
                        $("#area-modal").modal("hide");
                    });
                };
            }
        }
    })
})