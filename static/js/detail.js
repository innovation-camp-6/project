$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const selectRestaurant = id.split("/")[0]
    const db = id.split("/")[2]
    const dbitem = id.split("/")[1]
    const dbitemid = [dbitem,db].join('/')
    const imageUrl = window.staticBaseUrl + "img/userimg.png";
    styledHeader()
    getMenu()
    formSection()
    sideMenu()
    getContent()

    // styledHeader 함수형 컴포넌트
    function styledHeader () {
      $('.styledHeader').append(`
        <div onclick="location.href='/'"><h1>HwaN's Choise</h1></div>
        <h3>${selectRestaurant}</h2>
        
      `);
    }
  
    // contentForm 함수형 컴포넌트 
    function formSection () {
      $('.contentForm').append(`
            <fieldset>
              <legend>후기 작성</legend>
              <div class="nickName">
                <input 
                  required 
                  type="text" 
                  id="nickName" 
                  maxlength="20"
                  placeholder="닉네임(20자) **">
              </div>
              <div class="content">
                <input 
                  required
                  type="text"
                  id="content" 
                  maxlength="300"
                  placeholder="댓글을 입력해주세요(300자) **">
              </div>
              <div class="submit">
                <input type="submit" value="댓글 작성">
              </div>
            </fieldset>
      `)
    }

    // contentForm의 onSubmit 함수선언문
    $('.contentForm').on('submit', function(event) {
      event.preventDefault()
      let nickName = $('#nickName').val()
      let content = $('#content').val()
      let date = Date.now()
      let menuName = id.split("/")[1]
      let contentId = menuName + date

      $.ajax({
        type: "POST",
        url: "/content",
        data: { id: contentId, nickName, content, date, menuName },
        success: function () {
          getContent() 
          $('#nickName').val('')
          $('#content').val('')
        }
      });
    })

    // getMenu 상세페이지에서 조회할 음식메뉴 API
    function getMenu() {
      db 
        ? $.ajax({
          type: "POST",
          url: `/detaildb`,
          data: {dbitemid},
          success: function (response) {
            let { img, name, dsc, price } = response['result'][0]
            $('.contentOutLine').append(`
                  <figure class="img_box">
                      <img src="${img}" alt="menu" onerror="this.src='static/img/fallback_image.jpg'">
                    </figure>
                    <div class="contentInLine">
                      <div class="contentBox">
                          <p>${dsc}</p>
                          <p>${name}</p>
                          <p>${Math.ceil(price * 130)}원</p>
                      </div>
                    </div>
            `);
          }
        })
        : $.ajax({
          type: "GET",
          url: `https://free-food-menus-api-production.up.railway.app/${id}`,
          data: {},
          success: function (response) {
            $('.contentOutLine').empty()
            let { img, name, dsc, price } = response
            $('.contentOutLine').append(`
                  <figure class="img_box">
                      <img src="${img}" alt="menu" onerror="this.src='static/img/fallback_image.jpg'">
                    </figure>
                    <div class="contentInLine">
                      <div class="contentBox">
                          <p>${dsc}</p>
                          <p>${name}</p>
                          <p>${Math.ceil(price * 130)}원</p>
                      </div>
                    </div>
            `);
          }
        })
    }

    // sideMenu 사이드바에서 렌덤으로 조회할 음식메뉴 API
    function sideMenu() {
      $.ajax({
        type: "GET",
        url: `https://free-food-menus-api-production.up.railway.app/${selectRestaurant}`,
        data: {},
        success: function (response) {
          let itemArray = []
          for (let i = 0; i < 10; i++) {
            let img = response[Math.floor((i + (Math.random() * 20)))]['img']
            let menuName = response[Math.floor((i + (Math.random() * 20)))]['id']
            let temp_html = `<figure class="sideImg_box">
                                <img src="${img}" onerror="this.src='static/img/fallback_image.jpg'">
                                <p class="sideName">${menuName}</p>
                              </figure>`
            $('.sectionRight').append(temp_html)
          }
        }
      })
    }   

    // getContent 해당 getMenu에 대한 댓글 조회 DB API
    function getContent() {
      $('.contentContainer').empty()
      $.ajax({
        type: "GET",
        url: "/content",
        data: {},
        success: function (response) {
          let contents = response['result'].filter(el => el.menuName === id.split("/")[1])
            contents.reverse().forEach(({ id, content, nickName, date }) => {
            let time = new Date(Number(date))
            const getFullYear = time.getFullYear();
            const getMonth = time.getMonth() + 1 < 10 ? "0"+String(time.getMonth() + 1) : time.getMonth() + 1;
            const getDate = time.getDate()  < 10 ? "0"+time.getDate() : time.getDate();
            const translateDate = `${getFullYear}-${getMonth}-${getDate}`
            $('.contentContainer').append(`
                  <div class="contentListWrap">
                    <figure class="profileArea">
                      <img src="${imageUrl}" alt="userimg" width="100px">
                    </figure>
                    <div class="contentListArea">
                      <p>${content}</p>
                      <p class="author">${nickName} <span>${translateDate}<span></p>
                    </div>
                  </div>
              `);
          })
        }
      });
    }
})