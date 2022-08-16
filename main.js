// 1.url준비
// 2.헤더준비
// 3.서버에 요청 ------>서버에서 데이터 올 때까지 기다려야함...
// 4.데이터를 보여줌

let news = [];
let page = 1;
let total_pages = 0;
let url;
let Menu = document.querySelectorAll(".menus button") //메뉴들의 버튼을 가져옴

Menu.forEach((menu) => {
    menu.addEventListener("click", (event) => getNewsByTopic(event))
})

// Menu.forEach(function fun1(menu){
//     menu.addEventListener("click",function fun2(event){
//         getNewsByTopic(event)
//     })
// })

let UserInput = document.getElementById("search-input");
let SearchButton = document.getElementById("search-button");


//
const getNews = async () => {

    try {
        let header = new Headers({
            "x-api-key": "hAvwXeSQl5nsA1wHlnHNVWgkIuudGB5n52Hglgfbrxo"
        });

        url.searchParams.set('page', page);
        let response = await fetch(url, { headers: header }); //ajax, http, fetch 이용가능. async와 await은 셋트셋트~ : 기다려~~
        let data = await response.json();

        if (response.status == 200) {
            if (data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다.")

            }
            total_pages = data.total_pages;
            page = data.page;
            news = data.articles; //api로 얻은 기사들을 저장!
            render();
            pageNation();
        }
        else {
            throw new Error(data.message)
        }
    }

    catch (error) {
        errorRender(error.message)
    }

}

//최근 비즈니스 기사노출
const getLatestNews = async () => {
    url = new URL("https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10");
    getNews();
}

//주제별 클릭 시, 기사노출
const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();

    UserInput.value = ''; //주제클릭 시, 검색창에 있는 값 지우기
}

//키워드 입력한대로 기사 노출
const getNewsByKeyword = async () => {
    //1.검색 키워드 읽어오기
    //2.url에 검색 키워드 붙이기
    //3.헤더준비
    //4.url 부르기
    //5.데이터 가져오기
    //6.데이터 보여주기
    let keyword = UserInput.value;

    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    getNews();
    keyword = '';
}

const render = () => {
    let newsHTML = "";

    //array 함수사용! map은 배열을 리턴함!
    newsHTML = news.map((item) => {
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}"
                alt="기사이미지">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.summary}
            </p>
            <div>
              ${item.rights} * ${item.published_date}
            </div>
        </div>
    </div>`
    }).join(''); //map함수 사용으로 인해 반환된 배열에서 ,(콤마)를 제거해줌

    document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert" >${message}</div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
}


//1.page 정보기준으로 내가 몇번째 그룹인지 안다. Math.ceil(page/5)
//2.그룹의 첫번째와 마지막 페이지를 안다. 마지막:그룹숫자 * 5, 첫번째: 마지막 - 4
//3.첫번째부터 마지막 페이지까지 그려준다.(현재 페이지에 하이라이트) for(첫 ~마지막)
const pageNation = () => {
    let pagenationHTML = ''
    let first;
    let last;

    // page_group
    let page_group = Math.ceil(page / 5);

    //last
    last = page_group * 5;
    if(last > total_pages){
        last = total_pages;
    }
    
    //first
    first = last - 4 <= 0 ? 1 : last - 4;

    // if(last <= 5){
    //     first = 1;
    // }
    // else{
    //     first = last - 4;
    // }

    //page 3일경우 3개의 페이지만 프린트 하는 법!

    if (page == 1) {
        pagenationHTML += '';
    }
    else {
        pagenationHTML += `<li class="page-item">
             <a class="page-link" href="#" aria-label="Previous" onclick="moveTopage(${1})">
             <span aria-hidden="true">&laquo;</span>
             </a>
             </li>
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Previous" onclick="moveTopage(${page - 1})">
              <span aria-hidden="true">&lt;</span>
               </a>
            </li>`
    }

    for (let i = first; i <= last; i++) {
        pagenationHTML += `<li class="page-item ${page == i ? "active" : ""}" ><a class="page-link" href="#" onclick="moveTopage(${i})">${i}</a></li>`
    }

    if (page == total_pages) {
        pagenationHTML += '';
    }
    else {
        pagenationHTML += `<li class="page-item">
         <a class="page-link" href="#" aria-label="Next" onclick="moveTopage(${page + 1})">
         <span aria-hidden="true">&gt;</span>
         </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onclick="moveTopage(${total_pages})">
          <span aria-hidden="true">&raquo;</span>
           </a>
        </li>`
    }


    document.querySelector(".pagination").innerHTML = pagenationHTML;
}

const moveTopage = (pageNum) => {
    //1.이동하고 싶은 페이지를 알아야함
    page = pageNum;
    //2.이동하고 싶은 페이지를 가지고 api를 다시 호출해줘야함!
    getNews();
}

getLatestNews();

SearchButton.addEventListener("click", getNewsByKeyword);

UserInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        console.log("엔터!")
        getNewsByKeyword();
    }
});










