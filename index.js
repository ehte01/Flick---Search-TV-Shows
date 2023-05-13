const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = "7a038efbeb2e81cc94c450775948cfd7";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";
const movieGrid = document.querySelector('.movies-grid');
const searchInput = document.querySelector('#search-input');
const formSearch= document.querySelector('#search-form');
let gridTitle = document.querySelector(".grid-title");
const logo = document.querySelector(".logo");
const movieCard = document.querySelector(".movie-card");



window.onload = fetchMoviesNowPlaying();

async function fetchMoviesNowPlaying(){

    const response = await fetch(`https://api.tvmaze.com/shows`);
    const jsonResponse = await response.json();
    const movies = jsonResponse.results;
    console.log(jsonResponse);
    let showArray = [];
    for(let i=0;i<30;i++){
        showArray[i] = jsonResponse[i]
    }
    displayMovies(showArray);

    //to fetch movies title
    // movies.forEach((ele)=>{
    //     console.log(ele.original_title);
    // });
}
function displaySearchedMovies(movies){
    let fragment = document.createDocumentFragment();         //less reflow and repaint
    const movieSrcInit = movies[0].show.image.medium;
    movies.forEach((movie) => {
        let elementDiv = document.createElement("div");
        elementDiv.className = "movie-card";
        let imgElement = document.createElement("img");
        imgElement.src = movie.show.image.medium;
        if(imgElement.src == null){
            imgElement.src = movieSrcInit;
        }
        console.log(imgElement.src);
        let movieRate = movie.show.rating.average;
        let movieName = movie.show.name;
        if(movieRate==null){
            movieRate = "NA";
        }
        let para = `
                <p>&#11088; ${movieRate}</p>
                <h1>${movieName}</h1>
            `;
        elementDiv.appendChild(imgElement);
        elementDiv.insertAdjacentHTML("beforeend",para);
        fragment.appendChild(elementDiv);
    });

    movieGrid.appendChild(fragment);

}
async function searchMovies(moviequery){

    try{
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${moviequery}`);
        const jsonResponse = await response.json();
        const movies = jsonResponse;
        gridTitle.innerText = "Searched Movies";
        removePrevMovies();
        console.log(jsonResponse);
        displaySearchedMovies(movies);
    }catch(e){
        console.log("problem in fetching Api");
    }
    
}

function removePrevMovies(){

    while(movieGrid.children.length>0){
        movieGrid.removeChild(movieGrid.firstChild);
    }
    
}

function displayMovies(movies){
    let fragment = document.createDocumentFragment();         //less reflow and repaint
    movies.forEach((movie) => {
        let elementDiv = document.createElement("div");
        elementDiv.className = "movie-card";
        let imgElement = document.createElement("img");
        imgElement.src = movie.image.medium;
        let movieRate = movie.rating.average;
        let movieName = movie.name;
        if(movieRate==null){
            movieRate = "NA";
        }
        let para = `
                <p>&#11088; ${movieRate}</p>
                <h1>${movieName}</h1>
            `;
        elementDiv.appendChild(imgElement);
        elementDiv.insertAdjacentHTML("beforeend",para);
        fragment.appendChild(elementDiv);
    });

    movieGrid.appendChild(fragment);
}
formSearch.addEventListener('submit',(e)=>{
    e.preventDefault();
    const searchQuery = searchInput.value;
    if(searchQuery!==""){
        searchMovies(searchQuery);
    } 
});

logo.addEventListener('click',()=>{
    gridTitle.innerText = "Now Playing movies";
    removePrevMovies();
    fetchMoviesNowPlaying();
});

//for single page
let singlePageContent = document.querySelector('.content');
let singleTitle = document.querySelector('.single-title');
let singleImage = document.querySelector(".single-image");
let singleImagesrc;
let singleRating;
let singlePara;
let singleLanguage;
let genre="";
async function singleSearchMovies(moviequery){

    const response = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${moviequery}`);
    const jsonResponse = await response.json();
    const movies = jsonResponse;
    singleImagesrc = movies.image.medium;
    singleRating = movies.rating.average;
    singlePara = movies.summary;
    singleLanguage = movies.language;
    console.log(jsonResponse);
    for(let i=0;i<movies.genres.length;i++){
        if(i===movies.genres.length-1){
            genre = genre + movies.genres[i];
        }else{
            genre = genre + movies.genres[i]+" | ";
        }
        
    }
    if(singleRating == null){
        singleRating = "NA";
    }
    storageImgsrc(singleImagesrc);
    storagePara(singlePara);
    storageLanguage(singleLanguage);
    storageGenre(genre);
    console.log(singleRating);
    storageRate(singleRating);
    window.location.href = "singlepage.html";
}

movieGrid.addEventListener('click',(e)=>{
    const singleSearch = e.target.parentElement.children[2].innerText; 
    singleImagesrc = e.target.parentElement.children[0].src;
    singleTitle= singleSearch;
    storageTitle(singleTitle);
    singleSearchMovies(singleSearch);
    
});

function storageTitle(title){
    localStorage.setItem("singleTitle",title);
}
function storageImgsrc(img){
    localStorage.setItem("singleImg",img);
}
function storagePara(para){
    localStorage.setItem("singlePara",para);
}
function storageLanguage(lan){
    localStorage.setItem("singleLanguage",lan);
}
function storageGenre(genre){
    localStorage.setItem("Genre",genre);
}
function storageRate(rate){
    localStorage.setItem("Rating",rate);
}