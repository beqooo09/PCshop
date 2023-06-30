//loading svg
const loadingScreen = document.querySelector('#loading-screen');
const loadingScreenImg = document.querySelector('#loading-screen img');

setTimeout(() => {
    if (loadingScreen) {
        loadingScreen.style.opacity = 0;
        loadingScreen.style.pointerEvents = 'none';
        loadingScreenImg.style.display = 'none';
    }

}, 1500)
 
// Variablat per pjesen e navigaton menu
const navigationHeader = document.querySelector('header#navigation-header');
const navigationHeaderLinks = document.querySelectorAll('header#navigation-header .nav-links');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('#navigation-header nav');
const navMenuLists = document.querySelectorAll('#navigation-header nav > ul > li');
const dropdown = navMenuLists[navMenuLists.length - 1];
//

const goBottomBtn = document.querySelector('.go-bottom');


// buttoni per scroll up
const goUpBtn = document.querySelector('.go-up-btn');


let isHeaderTransparent = true;
window.addEventListener('scroll', () => {
    changeHeaderViewOnScroll();
    showHideScrollUpBtn();
})

function changeHeaderViewOnScroll() {
    if (window.scrollY >= 100 && isHeaderTransparent) {;
        navigationHeader.style.backgroundColor = 'rgb(214, 214, 214)';
        dropdown.style.color = 'black'
        navigationHeader.style.minHeight = '8vh';
        navigationHeader.style.fontSize = '14px'
        navigationHeader.style.boxShadow = '0 1px 10px -7px gray';
        navigationHeaderLinks.forEach(link => {
            link.style.color = 'black'
        })
        isHeaderTransparent = false;
    }
    if (window.scrollY < 100 && !isHeaderTransparent) {
        navigationHeader.style.backgroundColor = 'transparent';
        dropdown.style.color = 'rgb(54, 193, 235)'
        navigationHeader.style.minHeight = '10vh';
        navigationHeader.style.fontSize = '16px'
        navigationHeader.style.boxShadow = 'none';
        navigationHeaderLinks.forEach(link => {
            link.style.color = 'rgb(0, 195, 255)';
        })
        isHeaderTransparent = true;
    }
}

// Shfaqja e hamburger menus kur klikohet
hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    if (!hamburgerMenu.classList.value.includes('opened')) {
        hamburgerMenu.classList.add('opened')
    }
    else {
        hamburgerMenu.classList.remove('opened')
    }
});

goBottomBtn && goBottomBtn.addEventListener('click', () => {
    scrollTo({
        top: goBottomBtn.parentElement.clientHeight,
        behavior: "smooth"
    });
});

let isScrollUp = false;
function showHideScrollUpBtn() {
    if (window.scrollY >= 400 && !isScrollUp) {
        goUpBtn.style.display = 'flex';
        isScrollUp = true;
    }
    if (window.scrollY < 400 && isScrollUp) {
        goUpBtn.style.display = 'none';
        isScrollUp = false;
    }
}

goUpBtn.addEventListener('click', () => {
    scroll({
        top: 0,
        behavior: "smooth"
    })
})


