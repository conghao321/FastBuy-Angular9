from flask import Flask,send_from_directory,send_file
from flask import request

app = Flask(__name__)

@app.route('/',methods=['GET','POST'])
def index():
    return send_file('index.html')


@app.route('/req',methods=['POST'])
def success():
    print(request.form)  # ImmutableMultiDict([('user', 'Oldboy'), ('pwd', 'DragonFire')])
    # ImmutableMultiDict 它看起來像是的Dict 就用Dict的方法取值試一下吧
    print(request.form["num1"])  # Oldboy
    print(request.form.get("num2"))  # DragonFire
    # 看來全部才對了, ImmutableMultiDict 似乎就是個字典,再來玩一玩它
    print(list(request.form.keys()))  # ['user', 'pwd'] 看來是又才對了
    #如果以上所有的方法你都覺得用的不爽的話
    req_dict = dict(request.form)
    print(req_dict)  # 如果你覺得用字典更爽的話,也可以轉成字典操作(這裡有坑

    print(request.args)
    return 'haha'