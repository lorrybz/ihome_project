import os
import random
import re
import uuid

from flask import Blueprint, request, redirect, url_for, render_template, jsonify, session
from flask_login import login_user, LoginManager, logout_user, login_required, current_user

from app.models import User

# 对manage.py中的初始化做准备
login_manage = LoginManager()
user_blue = Blueprint('user',__name__)


@user_blue.route('/user_info/',methods=['GET'])
def user_info():
    user = User.query.filter_by(name=current_user.name).first()
    return jsonify({'code':200,'data':user.to_basic_dict()})


# 实名认证
@user_blue.route('/auth/',methods=['GET'])
@login_required
def auth():
    user = User.query.filter_by(name = current_user.name).first()
    # user = User.query.filter(User.name == current_user.name).first()
    return render_template('auth.html')


@user_blue.route('/auth/',methods=['POST'])
@login_required
def my_auth():
    user = User.query.filter_by(name = current_user.name).first()
    id_name = request.form.get('id_name')
    id_card = request.form.get('id_card')
    # 校验是否填写完全
    if not all([id_name,id_card]):
        return jsonify({'code':1001,'msg':'请填写完整的信息'})
    if not re.match('^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$',id_card):
        return jsonify({'code':1002,'msg':'身份证号码输入不符合规范'})
    if not re.match('^[\u4ee0-\u9fa5]{2,5}$',id_name):
        return jsonify({'code':1003,'msg':'长度不超过7位，不少于2两位，且为汉字'})
    # 校验身份证号码是不是符合规范
    else:
        user.id_name = id_name
        user.id_card = id_card
        user.add_update()
        return jsonify({'code':200})


# 登录
@user_blue.route('/login/',methods=['GET'])
def login():
    return render_template('login.html')


# 登录
@user_blue.route('/login/',methods=['POST'])
def my_login():
    mobile = request.form.get('mobile')
    password = request.form.get('passwd')
    if not all([mobile,password]):
        return jsonify({'code':1001,'msg':'请输入完整'})
    if not re.match('^1[3456789]\d{9}$',mobile):
        return jsonify({'code':1002,'msg':'手机号格式不正确'})
    user = User.query.filter_by(phone=mobile).first()
    if not user:
        return jsonify({'code':1003,'msg':'账号不存在，请注册'})
    if user:
        if not user.check_pwd(password):
            return jsonify({'code':1004,'msg':'密码或账号错误，请检查'})
        else:
            # 使用flask-login实现登录操作
            # 向session中存键值对，键为user_id,值为id值。
            login_user(user)
            return jsonify({'code': 200, 'msg': '请求成功'})


# 注册
@user_blue.route('/register/',methods=['GET'])
def register():
    return render_template('register.html')

# 注册
@user_blue.route('/register/',methods=['POST'])
def my_register():
    # 获取参数
    mobile = request.form.get('mobile')
    imagecode = request.form.get('imagecode')
    passwd = request.form.get('passwd')
    passwd2 = request.form.get('passwd2')
    #1.验证参数是否都填写
    if not all([mobile,imagecode,passwd,passwd2]):
        return jsonify({'code':1001, 'msg':'请填写完整参数'})
    #2.验证手机号正确
    if not re.match('^1[3456789]\d{9}$',mobile):
        return jsonify({'code':1002,'msg':'手机号不正确'})
    #3.验证图片验证码
    if session['img_code'] != imagecode:
        return jsonify({'code':1003,'msg':'验证码不正确'})
    #4 确认密码是否一致
    if passwd != passwd2:
        return jsonify({'code':1004,'msg':'密码不一致'})
    #5.验证手机号码是否一致
    user = User.query.filter_by(phone=mobile).first()
    if user:
        return jsonify({'code':1005,'msg':'手机号已经注册，请重新注册'})
    #6.创建注册信息
    user = User()
    user.phone = mobile
    user.name = mobile
    user.password = passwd
    user.add_update()
    return jsonify({'code':200,'msg':'请求成功'})


# 获取随机验证码
@user_blue.route('/code/',methods=['GET'])
def get_code():
    # 获取验证码
    # 方式1：后端生成图片，并返回验证码图片地址
    # 方式2：后端只生成随机参数，返回给页面，在页面中生成图片（前端做）
    s = '123456789qwertyuiopasdfhjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    code = ''
    for i in range(4):
        code += random.choice(s)
    session['img_code'] = code
    return jsonify({'code':200,'msg':'请求成功','data':code})


# 个人中心
@user_blue.route('/my/',methods=['GET'])
@login_required
def my():
    return render_template('my.html')

# 还可以后端传值
# @user_blue.route('/user_info/',methods=['GET'])
# def user_info():
#     user_id = session['user_id']


# 退出当前用户
@user_blue.route('/logout/',methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({'code':200})


# 进入修改界面
@user_blue.route('/profile/',methods=['GET'])
@login_required
def profile():
    return render_template('profile.html')


# 修改头像以及用户名
@user_blue.route('/profile_name/',methods=['PATCH'])
def profile_name():
    user = User.query.filter_by(phone=current_user.phone).first()
    name = request.form.get('name')
    if not all([name]):
        return jsonify({'code':1002,'msg':'用户名不能为空'})
    if user.name == name:
        return jsonify({'code':1001,'msg':'用户名已存在，重新输入'})
    else:
        user.name = name
        user.add_update()
        return jsonify({'code':200})


@user_blue.route('/profile_avatar/', methods=['PATCH'])
@login_required
def profile_avatar():
    user = User.query.filter_by(phone=current_user.phone).first()
    avatar = request.files.get('avatar')
    if not all([avatar]):
        return jsonify({'code':1001,'msg':'请选择图片'})
    else:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # 获取媒体文件路径
        STATIC_DIR = os.path.join(BASE_DIR, 'static')
        MEDIA_DIR = os.path.join(STATIC_DIR, 'media')
        filename = str(uuid.uuid4())
        a = avatar.mimetype.split('/')[-1:][0]
        name = filename + '.' + a
        path = os.path.join(MEDIA_DIR, name)
        avatar.save(path)
        user.avatar = name
        user.add_update()
        return jsonify({'code':200})


# 装饰器进行校验验证
@login_manage.user_loader
def load_user(user_id):
    # 定义被login_manage装饰的回调函数
    # 返回的是当前登录系统的用户对象
    # return User.query.filter(User.id==user_id).first()
    return User.query.get(user_id)