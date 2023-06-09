import certifi
from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

ca = certifi.where()
client = MongoClient('mongodb+srv://project:project@cluster0.fugqwge.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.test

@app.route('/')
def home():
   return render_template('index.html')

@app.route('/post')
def post():
   return render_template('post.html')

@app.route("/menu", methods=["POST"])
def menu_post():
    type_receive = request.form['type_give']   # 메뉴 종류 (type)
    name_receive = request.form['name_give']   # 식당 이름 (restaurant)
    dsc_receive = request.form['dsc_give']     # 메뉴 이름 (name)
    price_receive = request.form['price_give'] # 메뉴 가격 (price)
    url_receive = request.form['url_give']     # 메뉴 이미지 (image)
    id_receive = request.form['id_give']     # 메뉴 아이디 (id)

    doc = {
            'type':type_receive,
            'name':name_receive,
            'dsc':dsc_receive,
            'price':price_receive,
            'url':url_receive,
            'id':id_receive
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

@app.route('/commendsubmit', methods=['POST'])
def commendsubmit_post():
    # 폼 데이터 처리 로직을 작성합니다.
    data = request.form
    doc = {
      'id':data['id'],
      'nickName':data['nickName'],
      'content':data['content'],
      'date':data['date'],
      'menuName':data['menuName'],
    }
    db.content.insert_one(doc)
    return jsonify({'message': '폼 데이터가 성공적으로 제출되었습니다.'})

@app.route('/commendsubmit', methods=['GET'])
def commendsubmit_get():
  all_content = list(db.content.find({}, {'_id': False}))
  return jsonify({'result': all_content})

@app.route('/detail')
def detail():
  return render_template('detail.html') 
if __name__ == '__main__':
  app.run('0.0.0.0', port=5000, debug=True)