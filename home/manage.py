

from flask import Flask, render_template
from flask_script import Manager

from app.models import db
from app.user_views import user_blue, login_manage
from app.home_views import home_blue

app = Flask(__name__)
app.register_blueprint(blueprint=user_blue,url_prefix='/user')
app.register_blueprint(blueprint=home_blue,url_prefix='/home')
# 初始化数据库配置
# "mysql+pymysql://root:123456@localhost:3306/HelloFlask"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:123456@120.77.45.55:3306/ihome"
db.init_app(app)

app.secret_key = 'ajsda526g5d6as6da65d5s'
# 初始化flask_login
login_manage.init_app(app)
login_manage.login_view = 'home.index'

@app.route('/')
def index():
    return render_template('index.html')

manage = Manager(app)

if __name__ == '__main__':
    manage.run()