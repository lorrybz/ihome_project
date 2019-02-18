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

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}




$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);

});

$(document).ready(function(){
        $.ajax({
            url: '/home/order_info/',
            dataType: 'json',
            type: 'GET',
            success: function(data){
                if(data.code == '200'){
                    for(var index in data.orders_list){
                        var order = data.orders_list[index]

                        h3Node = $('<h3>订单编号：'+order.order_id+'</h3>')

                        div1Node = $('<div id="' + 'b'+ order.order_id + '" class="fr order-operate"></div>')
                        button1Node = $( '<button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>')
                        button2Node = $('<button  type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button>')
                        div1Node.append(button1Node)
                        div1Node.append(button2Node)
                        div2Node = $('<div class="order-title"></div>')
                        div2Node.append(h3Node)
//                        div2Node是第一个div
                        div2Node.append(div1Node)

                        ulNode = $('<ul></ul>')

                        li1Node = $('<li>创建时间：'+order.create_date+'</li>')
                        li2Node = $('<li>入住日期：'+order.begin_date+'</li>')
                        li3Node = $('<li>离开日期：'+order.end_date+'</li>')
                        li4Node = $('<li>合计金额：'+'￥'+order.amount+'(共'+order.days+'晚)'+'</li>')
                        status = order.status
                        if(status == 'WAIT_ACCEPT'){
                            var sta = '待接单'
                        };
                        if(status == 'WAIT_PAYMENT'){
                            var sta = '待支付'
                        };
                        if(status == 'PAID'){
                            var sta = '已支付'
                        };
                        if(status == 'WAIT_ACCEPT'){
                            var sta = '待接单'
                        };
                        if(status == 'WAIT_COMMENT'){
                            var sta = '待评价'
                        };
                        if(status == 'COMPLETE'){
                            var sta = '已完成'
                        };
                        if(status == 'CANCELED'){
                            var sta = '已取消'
                        };
                        if(status == 'REJECTED'){
                            var sta = '已拒单'
                        };
                        span1Node = $('<span>订单状态：</span>')
                        span2Node = $('<span>'+ sta +'</span>')
                        li5Node = $('<li></li>')
                        li5Node.append(span1Node)
                        li5Node.append(span2Node)
                        li6Node = $('<li></li>')
                        spanNode111 = $('<span id="' + 'aa' + order.order_id +'">客户评价：</span>')
                        spanNode222 = $('<span>' + order.comment + '</span>')
                        li6Node.append(spanNode111)
                        li6Node.append(spanNode222)

                        ulNode.append(li1Node)
                        ulNode.append(li2Node)
                        ulNode.append(li3Node)
                        ulNode.append(li4Node)
                        ulNode.append(li5Node)
                        ulNode.append(li6Node)

                        h3Node = $('<h3>'+order.house_title+'</h3>')
                        div3Node = $('<div class="order-text"></div>')
                        div3Node.append(h3Node)
                        div3Node.append(ulNode)

                        imgNode = $('<img>').attr('src',order.image)
                        div4Node = $('<div class="order-content"></div>')
                        div4Node.append(imgNode)
                        div4Node.append(div3Node)
                        li44Node = $('<li></li>').attr('order-id',order.order_id)
                        li44Node.append(div2Node)
                        li44Node.append(div4Node)
                        $('.orders-list').append(li44Node)

                        $('#b'+order.order_id).hide()
                        if(status == 'WAIT_ACCEPT'){
                            $('#b'+order.order_id).show()
                        }

                    }
                    $(".order-accept").on("click", function(){
                        var orderId = $(this).parents("li").attr("order-id");
                        $(".modal-accept").attr("order-id", orderId);
                    });
                    $(".order-reject").on("click", function(){
                        var orderId = $(this).parents("li").attr("order-id");
                        $(".modal-reject").attr("order-id", orderId);
                    });
                }
            }
    })
})


// 正在修改
$(document).ready(function(){
    $('.modal-reject').click(function(){
        //获取评论房子的id
        var order_id = $('.modal-reject').attr("order-id")
        var rejeck_result = $("#reject-reason").val();

        //发起请求下订单
        $.ajax({
            url:'/home/reject/',
            dataType: 'json',
            type: 'POST',
            data: {'order_id':order_id, 'rejeck_result':rejeck_result},
            success: function(data){
                console.log(data)
                if(data.code == '200'){
                    location.href='/home/lorders/';
                    $('#b'+order_id).hide()
                    $('#aa'+order_id).html('拒单原因：')
                };
            },
            error: function(data){
                alert('default')
            }
        })
    })
})

$(document).ready(function(){
    $('#accept11').click(function(){
        //获取评论房子的id
        var order_id = $('.modal-accept').attr("order-id")
        //发起请求下订单
        $.ajax({
            url:'/home/accept/',
            dataType: 'json',
            type: 'POST',
            data: {'order_id':order_id},
            success: function(data){
                console.log(data)
                if(data.code == '200'){
                    location.href='/home/lorders/';
                };
            },
            error: function(data){
                alert('default')
            }
        })
    })
})
