const playArea = document.getElementById('play-area');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const startButton = document.getElementById('start-btn');
const gameOverContainer = document.getElementById('game-over');
const gameOverText = document.getElementById('game-over-text');
const restartButton = document.getElementById('restart-btn');

let score = 0;
let missed = 0;
let gameInterval;
let speed = 3000; // Velocidade inicial
let gameRunning = false; // Para controle de estado do jogo
let currentObjects = []; // Para manter o controle dos objetos em queda

const phrases = [
  "Que pena! Você perdeu! 💔",
  "Jogo finalizado! Até a próxima! 👋",
  "Ops! Tente de novo! 🔄",
  "Fim de jogo! Bom trabalho! 💪"
];

function startGame() {
  score = 0;
  missed = 0;
  speed = 3000; // Reset da velocidade
  gameRunning = true; // Marca o jogo como ativo
  updateStats();
  startButton.style.display = 'none';
  gameOverContainer.style.display = 'none';
  currentObjects = []; // Limpar lista de objetos
  spawnObjects();
}

function spawnObjects() {
  gameInterval = setInterval(() => {
    if (!gameRunning) return; // Não cria novos objetos se o jogo acabou

    const object = document.createElement('div');
    object.classList.add('falling-object');

    // Randomiza o tipo de item
    const type = Math.random();
    if (type < 0.6) {
      object.classList.add('object1');
    } else if (type < 0.9) {
      object.classList.add('object2');
    } else if (type < 0.97) {
      object.classList.add('object3');
    } else {
      object.classList.add('special-item'); // Item especial
    }

    // Define a posição inicial aleatória
    object.style.left = Math.random() * (playArea.offsetWidth - 60) + 'px';
    playArea.appendChild(object);
    currentObjects.push(object); // Adiciona o objeto à lista de objetos

    // Detecta clique no objeto
    object.addEventListener('click', () => {
      if (object.classList.contains('special-item')) {
        score += 5; // Pontuação maior para o item especial
      } else {
        score++;
      }
      updateStats();
      object.remove();
      currentObjects = currentObjects.filter(item => item !== object); // Remove da lista
    });

    // Detecta quando o objeto atinge o final da tela
    object.addEventListener('animationend', () => {
      if (object.parentElement) {
        missed++; // Incrementa erros se o objeto atingir o final
        updateStats();
        object.remove(); // Remove o objeto ao atingir o final
        currentObjects = currentObjects.filter(item => item !== object); // Remove da lista
        checkGameOver();
      }
    });
  }, 800);

  // Aumenta a dificuldade com o tempo
  setInterval(() => {
    if (gameRunning && speed > 1000) speed -= 50;
  }, 5000);
}

function updateStats() {
  scoreDisplay.textContent = `Pontuação: ${score}`;
  missedDisplay.textContent = `Erros: ${missed} / 2`;
}

function checkGameOver() {
  if (missed >= 2) {
    gameRunning = false; // Para o estado do jogo
    clearInterval(gameInterval); // Para criação de objetos
    removeFallingObjects(); // Remove objetos restantes em queda
    endGame();
  }
}

function endGame() {
  // Atualiza a frase aleatória de Game Over
  gameOverText.textContent = `${phrases[Math.floor(Math.random() * phrases.length)]} Sua pontuação: ${score}`;
  gameOverContainer.style.display = 'block';
}

function removeFallingObjects() {
  // Remove todos os objetos que estão caindo
  currentObjects.forEach(object => {
    object.remove();
  });
  currentObjects = []; // Limpa a lista de objetos
}

restartButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);
