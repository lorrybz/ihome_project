import random
from _datetime import datetime

import os
import uuid

from flask import Blueprint, request, redirect, url_for, render_template, jsonify
from flask_login import current_user,login_required

from app.models import Area, Facility, House, HouseImage, Order

home_blue = Blueprint('home',__name__)

#主页
@home_blue.route('/index/',methods=['GET'])
def index():
    return render_template('index.html')


@home_blue.route('/index_info/',methods=['GET'])
def index_info():
    # 获取所有的地区
    areas = Area.query.all()
    aa = []
    for area in areas:
        aa.append(area.to_dict())
    # 获取所有的房子
    houses = House.query.all()
    houses_info = []
    lens = len(houses)
    a = 0
    b = 'a'
    while a <= 100:
        id = random.randint(0, lens - 1)
        if id == b:
            continue
        b = id
        houses_info.append(houses[id])
        if len(houses_info) == 3:
            break
        houses_info1 = []
    for hu in houses_info:
        houses_info1.append(hu.to_index_dict())
    return jsonify({'code':200,'data':aa, 'info': houses_info1})


# 获取当前搜索页面的传入的值
@home_blue.route('/search_update/',methods=['GET'])
def search_update():
    area_id = request.args.get('aid')
    houses1 = House.query.filter_by(area_id=area_id).all()
    houses = []
    for aa in houses1:
        houses.append(aa.to_full_dict())
    return jsonify({'code': 200,'data': houses})

@home_blue.route('/search_update1/',methods=['GET'])
def search_update1():
    area_id = request.args.get('id')
    houses1 = House.query.filter_by(area_id=area_id).all()
    houses = []
    for aa in houses1:
        houses.append(aa.to_full_dict())
    return jsonify({'code': 200,'data': houses})


@home_blue.route('/search/',methods=['GET'])
def search():
    return render_template('search.html')


@home_blue.route('/search/',methods=['POST'])
def my_search():
    return jsonify({'code':200})

# 验证是否登录用于判断主页的index
@home_blue.route('/is_user/',methods=['GET'])
def is_user():
    if not current_user.is_anonymous:
        return jsonify({'code':1001})
    else:
        return jsonify({'code':1002})

# 渲染发布的的页面
@home_blue.route('/myhouse/',methods=['GET'])
@login_required
def my_house():
    return render_template('myhouse.html')

# 渲染发布的的页面的详情信息，提交至ajax。
@home_blue.route('/myhouse_about/',methods=['GET'])
@login_required
def myhouse_about():
    houses = House.query.all()
    housess = []
    for house in houses:
        housess.append(house.to_dict())
    return jsonify({'code':200,'data':housess})

@home_blue.route('/newhouse/',methods=['GET'])
@login_required
def newhouse():
    return render_template('newhouse.html')


@home_blue.route('/newhouse/',methods=['POST'])
@login_required
def my_newhouse():
    # 获取参数
    title = request.form.get('title')
    price = request.form.get('price')
    area_id = request.form.get('area_id')
    address = request.form.get('address')
    room_count = request.form.get('room_count')
    acreage = request.form.get('acreage')
    unit = request.form.get('unit')
    capacity = request.form.get('capacity')
    beds = request.form.get('beds')
    deposit = request.form.get('deposit')
    min_days = request.form.get('min_days')
    max_days = request.form.get('max_days')
    facilitys = request.form.getlist('facility')
    if not all([title, price, area_id, address, room_count, acreage, unit, capacity,
                beds, deposit, min_days, max_days, facilitys]):
        return jsonify({'code': 1001, 'msg': '请将全部信息填写完整后再提交'})
    house = House()
    house.user_id = current_user.id
    house.price = price
    house.title = title
    house.area_id = area_id
    house.address = address
    house.room_count = room_count
    house.acreage = acreage
    house.unit = unit
    house.capacity = capacity
    house.beds = beds
    house.deposit = deposit
    house.min_days = min_days
    house.max_days = max_days
    for facilitie_id in facilitys:
        facility = Facility.query.get(facilitie_id)
        house.facilities.append(facility)
    # 房屋的设施
    house.add_update()
    house_id = house.id
    return jsonify({'code':200,'data':house_id})


@home_blue.route('/house_image/',methods=['POST'])
@login_required
def house_image():
    house_id = request.form.get('house_id')
    image = request.files.get('house_image')
    # 保存图片
    if not all([house_id, image]):
        return jsonify({'code': 1001,'msg': '请选择图片上传'})
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # 获取媒体文件路径
    STATIC_DIR = os.path.join(BASE_DIR, 'static')
    MEDIA_DIR = os.path.join(STATIC_DIR, 'media')
    filename = str(uuid.uuid4())
    a = image.mimetype.split('/')[-1:][0]
    name = filename + '.' + a
    path = os.path.join(MEDIA_DIR, name)
    # 保存房屋图片到本地
    image.save(path)
    # 保存房屋图片到数据库
    img_url = '/static/media/'+name
    house_image = HouseImage()
    house_image.house_id = house_id
    house_image.url = img_url
    house_image.add_update()
    # 创建房屋图片
    house = House.query.get(house_id)
    if not house.index_image_url:
        house.index_image_url = img_url
        house.add_update()
    return jsonify({'code':200,'data':img_url})


# 区域信息
@home_blue.route('/home_area/',methods=['GET'])
@login_required
def home_area():
    area = Area.query.all()
    are = []
    for ar in area:
        are.append(ar.to_dict())
    return jsonify({'code':200,'data': are})


@home_blue.route('/home_fac/',methods=['GET'])
@login_required
def home_fac():
    facs = Facility.query.all()
    facl = []
    for fac in facs:
        facl.append(fac.to_dict())
    return jsonify({'code':200,'data':facl})


@home_blue.route('/detail/',methods = ['GET'])
def detail():
    return render_template('detail.html')


@home_blue.route('/detail/<int:id>/',methods = ['GET'])
def my_detail(id):
    house = House.query.get(id)
    if house.user_id == current_user.id:
        return jsonify({'code': 1001, 'data': house.to_full_dict()})

    return jsonify({'code': 200, 'data': house.to_full_dict()})


@home_blue.route('/booking/',methods=['GET'])
@login_required
def booking():
    return render_template('booking.html')


@home_blue.route('/booking/<int:id>/',methods=['GET'])
@login_required
def my_booking(id):
    house = House.query.get(id)
    return jsonify({'code':200,'data':house.to_dict()})


@home_blue.route('/orders/',methods=['GET'])
@login_required
def orders():

    return render_template('orders.html')


@home_blue.route('/orders/',methods=['POST'])
@login_required
def my_orders():
    order_dict = request.form
    house_id = order_dict.get('house_id')
    start_date = datetime.strptime(order_dict.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(order_dict.get('end_date'), '%Y-%m-%d')
    if not all([start_date,end_date]):
        return jsonify({'code':1001,'msg':'请选择日期'})

    house = House.query.get(house_id)
    order = Order()
    order.user_id = current_user.id
    order.house_id = house_id
    order.begin_date = start_date
    order.end_date = end_date
    order.days = (end_date - start_date).days + 1
    order.house_price = house.price
    order.amount = order.days * order.house_price
    order.add_update()
    return jsonify({'code':200})


@home_blue.route('/order_info/',methods=['GET'])
@login_required
def order_info():
    orders = Order.query.filter_by(user_id=current_user.id).all()
    orders1 = []
    for order in orders:
        orders1.append(order.to_dict())
    return jsonify({'code': 200, 'orders_list': orders1})


@home_blue.route('/lorders/',methods=['GET'])
@login_required
def lorders():

    return render_template('lorders.html')


@home_blue.route('/lorders/',methods=['POST'])
@login_required
def my_lorders():
    order_id = request.form.get('order_id')
    comment = request.form.get('comment')
    order = Order.query.filter_by(id=order_id).first()
    order.comment = comment
    order.status = 'COMPLETE'
    order.add_update()
    return jsonify({'code':200})


@home_blue.route('/reject/',methods=['POST'])
@login_required
def reject():
    order_id = request.form.get('order_id')
    rejeck_result = request.form.get('rejeck_result')
    order = Order.query.filter_by(id=order_id).first()
    order.comment = rejeck_result
    order.status = 'REJECTED'
    order.add_update()
    return jsonify({'code':200})


@home_blue.route('/accept/',methods=['POST'])
@login_required
def accept():
    order_id = request.form.get('order_id')
    order = Order.query.filter_by(id=order_id).first()
    order.status = 'WAIT_PAYMENT'
    order.add_update()
    return jsonify({'code':200})
