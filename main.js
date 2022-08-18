//api호출을 통해서 뉴스 웹페이지 만들기

const API = "N9Hv5s1t6b94S4Jir2L9diZ_mVhhetn1S8GjcH_srps";

let news = [];
let url;
let Menu = document.querySelectorAll(".menus button");
let SearchInput = document.getElementById("search-input");
let SearchButton = document.getElementById("search-button");

// pagination
let page = 1;
let total_page = 1;


Menu.forEach((menu) => {
    menu.addEventListener("click", (event) => { getNewsByTopic(event) })
})

//api를 통한 뉴스데이터 불러오기
const getAPI = async () => {
    let header = new Headers({
        "x-api-key": API
    })
    url.searchParams.set('page', page); //url에 page query 추가해주기
    let response = await fetch(url, { headers: header });
    let data = await response.json();

    try {
        if (response.status == 200) {
            if (data.total_hits == 0) {
                console.log("검색결과없음")
                page = 0;
                total_page = 0;
                renderPagination();
                throw new Error(data.status);
            }
            console.log("정삭작동");
            news = data.articles;
            page = data.page;
            total_page = data.total_pages;
            render();
            renderPagination();
        }
        else {
            page = 0;
            total_page = 0;
            renderPagination();
            throw new Error(data.message)
        }

    } catch (error) {
        ErrorRender(error.message);
        page = 0;
        total_page = 0;
        renderPagination();
    }
};

//최근 뉴스가져오기(웹페이지 진입시 default로 노출되는 뉴스들)
const getNews = async () => {
    page = 1;
    url = new URL("https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10");
    getAPI();
}

//데이터에서 불러온 뉴스를 웹페이지에 그려주는 함수
const render = () => {
    let newsHTML = '';

    newsHTML += news.map((item) => {
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}" alt="기사 이미지">
        </div>
        <div class="col-lg-8">
            <h2>
                ${item.title}
            </h2>
            <p>
                ${item.summary}
            </p>
            <div>
                ${item.rights} ${item.published_date}
            </div>
        </div>
    </div>`
    }).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
}

//주제별로 뉴스찾기 
const getNewsByTopic = async (event) => {
    page = 1;
    let topic = event.target.textContent.toLowerCase(); //topic이 다 소문자로 되어있어서,,,
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`);
    getAPI();

}

//입력값에 맞는 뉴스찾기
const getNewsByKeyword = async () => {
    page = 1;
    let keyword = SearchInput.value
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&&countries=KR&page_size=10`);
    getAPI();
}

//pagination 그려주기
const renderPagination = () => {
    let pageHTML = '';

    //page_group
    let page_group = Math.ceil(page / 5);

    //page_group - last
    let last = page_group * 5;

    if (last > total_page) {
        last = total_page; //마지막 그룹이 페이지가 5개 미만
    }

    //page_group - first
    if (last < 5) {
        first = 1; //첫 그룹의 페이지가 5개 미만
    }
    else {
        first = last - 4;
    }


    if (first >= 6) {
        pageHTML = `<li class="page-item">
        <a class="page-link" href="#" onclick="moveToPage(${1})">
          <span aria-hidden="true">&lt&lt;</span>
        </a>
        </li>`

        pageHTML += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
          <span aria-hidden="true">&lt;</span>
        </a>
        </li>`
    }

    for (let i = first; i <= last; i++) {
        pageHTML += `<li class="page-item ${(page == i) ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    if (last < total_page) {
        pageHTML += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
          <span aria-hidden="true">&gt;</span>
        </a>
        </li>`

        pageHTML += `<li class="page-item">
        <a class="page-link" href="#" onclick="moveToPage(${total_page})">
          <span aria-hidden="true">&gt&gt;</span>
        </a>
        </li>`
    }



    document.querySelector(".pagination").innerHTML = pageHTML;
}

//페이지 선택시, 해당 페이지로 이동
const moveToPage = (pageNum) => {
    page = pageNum;
    getAPI();
}

//에러발생시, 문구 띄우기!
const ErrorRender = (message) => {
    let ErrorHTML = `<div class=" text-center alert alert-danger" role="alert">
    ${message}
  </div>`
    document.getElementById("news-board").innerHTML = ErrorHTML;
}

SearchButton.addEventListener("click", getNewsByKeyword);
SearchInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        getNewsByKeyword();
    }
})

getNews();

