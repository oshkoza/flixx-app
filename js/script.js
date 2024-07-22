
function highlightActiveLink(){
    const links = document.querySelectorAll('.nav-link')
    links.forEach(link => {
        if(link.pathname === global.currentPage){
            link.classList.add('active')
        }
    })
    
}

const global = {
    currentPage: window.location.pathname
};

function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html': console.log('Home')
        break;
        case '/shows.html': console.log('Shows')
        break;
        case '/movie-details.html': console.log('Shows')
        break;
        case '/tv-details.html': console.log('Shows')
        break;
        case '/search.html': console.log('Shows')
        break;
    }

    
}



document.addEventListener('DOMCintentLoaded', highlightActiveLink())