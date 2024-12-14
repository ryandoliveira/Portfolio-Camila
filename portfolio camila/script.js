const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeModal = document.getElementById('close-modal');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let currentIndex = 0;

// Função para mover o carrossel
function moveCarousel() {
    currentIndex = (currentIndex + 1) % items.length;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Chama a função moveCarousel a cada 3 segundos (3000ms)
setInterval(moveCarousel, 3000);

// Adiciona evento de clique nas imagens do carrossel para abrir o modal
items.forEach((item, index) => {
    item.querySelector('img').addEventListener('click', () => {
        modal.style.display = 'block';  // Exibe o modal
        modalImg.src = item.querySelector('img').src;   // Define a imagem no modal
        currentIndex = index;  // Armazena o índice da imagem clicada
    });
});

// Navega para a imagem anterior
prev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    modalImg.src = items[currentIndex].querySelector('img').src;
});

// Navega para a próxima imagem
next.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    modalImg.src = items[currentIndex].querySelector('img').src;
});

// Adiciona evento de clique no botão "Fechar" para fechar o modal
closeModal.addEventListener('click', () => {
modal.style.display = 'none';  
});