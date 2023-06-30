const priceBtns = document.querySelectorAll('#prebuild-pc-section .single-pc .price-btn');
if ('speechSynthesis' in window) {

    var synthesis = window.speechSynthesis;

    // Create an utterance object
    var utterance = new SpeechSynthesisUtterance();

    priceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let price = btn.getAttribute('data-price');
            utterance.text = price;
            synthesis.speak(utterance);
        });
    })

} else {
    console.log('Text-to-speech not supported.');
} 
