from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://sparta:test@cluster0.hvbm5gf.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
   return render_template('index.html')

@app.route('/post')
def post():
   return render_template('post.html')


@app.route("/menu", methods=["POST"])
def menu_post():
    type_receive = request.form['type_give'] # 메뉴 종류 (type)
    name_receive = request.form['name_give'] # 식당 이름 (restaurant)
    dsc_receive = request.form['dsc_give'] # 메뉴 이름 (name)
    price_receive = request.form['price_give'] # 메뉴 가격 (price)
    url_receive = request.form['url_give'] # 메뉴 이미지 (image)

    doc = {
            'type':type_receive,
            'name':name_receive,
            'dsc':dsc_receive,
            'price':price_receive,
            'url':url_receive
            }
    db.menu.insert_one(doc)
    return jsonify({'msg': '저장 완료!'})

@app.route("/menu", methods=["GET"])
def menu_get():
    all_menus = list(db.menu.find({},{'_id':False}))
    return jsonify({'result': all_menus})
  
@app.route('/test')
def test():
  return render_template('edwinTest.html')

@app.route('/main')
def main():
  return render_template('edwinDetail.html')

@app.route('/detail')
def detail():
  return render_template('detail.html')  

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)
