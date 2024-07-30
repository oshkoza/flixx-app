async function search(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)

    global.search.term = urlParams.get('search-term')
    global.search.type = urlParams.get('type')

    if(global.search.term !== '' && global.search.type !== ''){
        const {results, total_pages, page, total_results} = await searchAPIData();
        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;

        if(results.length === 0){
            showAlert('No results found')
            return;
        }

        displaySearchResults(results);
        document.querySelector('#search-term').value = '';
    }else{
        showAlert('Please enter a search term')
    }
    
}

function displaySearchResults(results){
    //clear prev results
    document.querySelector('#search-results').innerHTML = ''
    document.querySelector('#search-results-heading').innerHTML = ''
    document.querySelector('#pagination').innerHTML = ''

    results.forEach(result => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${result.poster_path ? 
            `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${global.search.type === 'movie' ? result.title : result.name}"/>` 
              : 
              `<img src = '../images/no-image.jpg' 
              class='card-img-top' 
              alt ="${global.search.type === 'movie' ? result.title : result.name}"/>` 
            }
          

          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired:${global.search.type === 'movie' ? result.release_date : result.first_air_date} </small>
            </p>
          </div>
        `

        document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} Results for "${global.search.term}"</h2>
        `
        document.querySelector('#search-results').appendChild(div)
        })
        displayPagination();
}

//display pagination for search
function displayPagination(){
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `

    document.querySelector('#pagination').appendChild(div)

    //Disable prev button if on first page 

    if(global.search.page === 1){
        document.querySelector('#prev').disabled = true
    }

    //disble next if on last page
    if(global.search.page === global.search.totalPages){
        document.querySelector('#next').disabled = true
    }

    // next page
    document.querySelector('#next').addEventListener('click', async() => {
        global.search.page++;
        const {results, total_pages} = await searchAPIData();
        displaySearchResults(results)
    })

    //prev page
    document.querySelector('#prev').addEventListener('click', async() => {
        global.search.page--;
        const {results, total_pages} = await searchAPIData();
        displaySearchResults(results)
    })
}


//Displaying popular movies on index
async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');


    results.forEach(movie => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        <img
        ${movie.poster_path ? 
            `<img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' 
            class="card-img-top" 
            alt="${movie.title}"/>` 
            : 
            `<img src = '../images/no-image.jpg' 
            class='card-img-top' 
            alt ='${movie.title}' />`
        }
        </a>
        <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
        </div>
        `
        document.getElementById('popular-movies').appendChild(div)
    })

}

//Displaying movie details
async function displayMovieDetails(){
    const movieID = window.location.search.slice(4)
    const movie = await fetchAPIData(`movie/${movieID}`);

    displayBackgroundImage('movie', movie.backdrop_path)

    const div = document.createElement('div')
    div.innerHTML = `
    <div class="details-top">
          <div>
          ${movie.poster_path ? `
              <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` : 
            `<img src = '../images/no-image.jpg' 
            class='card-img-top' 
            alt ="${movie.title}"/>` 
            }

          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${numberWithCommas(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}</div>
        </div>
    `

    document.querySelector('#movie-details').appendChild(div)
}

//Display popular shows on index
async function displayPopularShows() {
    const { results } = await fetchAPIData('tv/popular');


    results.forEach(show => {
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="card">
          <a href="tv-details.html?id=${show.id}">
            ${show.poster_path ? 
            `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"/>` 
              : 
              `<img src = '../images/no-image.jpg' 
              class='card-img-top' 
              alt ="${show.name}"/>` 
            }
          

          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>
        </div>
        `

        document.getElementById('popular-shows').appendChild(div)
    })

}

//Display show details
async function displayShowDetails(){
    const showID = window.location.search.slice(4)
    const show = await fetchAPIData(`tv/${showID}`)

    displayBackgroundImage('show', show.backdrop_path)

    const div = document.createElement('div')
    div.innerHTML = `
        
        <div class="details-top">
          <div>
          ${show.poster_path ? 
            `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
            />` : 
            `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
            />`
            }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map(company => `<li>${company.name}</li>`).join('')}</div>
        </div>
    `

    document.querySelector('#show-details').appendChild(div)
}

//Spinner show/hide on load
function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
}
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')
}


//Backdrop for movie and show details page
function displayBackgroundImage(type, backgroundPath){
    const overlayDiv = document.createElement('div')
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.15';

    if(type === 'movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv)
    }else if(type === 'show'){
        document.querySelector('#show-details').appendChild(overlayDiv)
    }
}

async function displaySlider(){
    const {results} = await fetchAPIData('movie/now_playing')

    results.forEach(movie => {
        const div = document.createElement('div')
        div.classList.add('swiper-slide')
        div.innerHTML = `
                <a href="movie-details.html?id=${movie.id}">
                  <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                </a>
                <h4 class="swiper-rating">
                  <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
                </h4>
        `
        document.querySelector('.swiper-wrapper').appendChild(div)

        initSwiper()
    })
}

function initSwiper(){
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        allowTouchMove: true,
        spaceBetween: 30, 
        freeMode: true, 
        loop: true, 
        autoplay: {
            delay: 4000, 
            disableOnInteraction: false
        },
        breakpoints:{
            400:{
                slidesPerView: 2
            }, 
            700:{
                slidesPerView: 3
            }, 
            1200:{
                slidesPerView: 4
            }
        }
    })
}

//Fetch Data from API
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner()

    const response = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );

    const data = await response.json();

    hideSpinner()
    return data;
}

//Search
async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner()

    const response = await fetch(
        `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
    );

    const data = await response.json();

    hideSpinner()
    return data;
}


// Highlight Active Link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach(link => {
        if (link.pathname === global.currentPage) {
            link.classList.add('active')
        }
    })

}

//Show error Alert

function showAlert(message, classname = 'error'){
    const alertEl = document.createElement('div')
    alertEl.classList.add('alert', classname)
    alertEl.appendChild(document.createTextNode(message))
    document.querySelector('#alert').appendChild(alertEl)

    setTimeout(() => alertEl.remove(), 3000);
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

const global = {
    currentPage: window.location.pathname,
    search:{
        term: '',
        type : '', 
        page: 1,
        totalPages: 1,
        totalResults: 0.
    },
    api:{
        apiKey: '2f3b01f55e95e9b5408a85a45fcac008',
        apiUrl: 'https://api.themoviedb.org/3/',
    }
};

function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html': displaySlider(), displayPopularMovies();
            break;
        case '/shows.html': displayPopularShows();
            break;
        case '/movie-details.html': displayMovieDetails();
            break;
        case '/tv-details.html': displayShowDetails();
            break;
        case '/search.html': search()
            break;
    }

    highlightActiveLink()

}





document.addEventListener('DOMContentLoaded', init())