
const headerVideo = document.querySelector('#video-modal .video-section video');
const headerVideoBtn = document.getElementById('header-watch-video-btn');
const headerVideoModal = document.querySelector('#video-modal');
const headerHideVideoModal = document.querySelector('#video-modal .video-section span');
const headerStyles = getComputedStyle(navigationHeader);


headerVideoBtn && headerVideoBtn.addEventListener('click', () => {
    headerVideoModal.classList.add('active')
});

headerHideVideoModal && headerHideVideoModal.addEventListener('click', () => {
    headerVideoModal.classList.remove('active');
    headerVideo.pause()
    headerVideo.currentTime = 0;
})

