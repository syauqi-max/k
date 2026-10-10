const room = document.getElementById('room');
const handle = document.getElementById('stringHandle');
const path = document.getElementById('stringPath');
const fireflies = document.getElementById('fireflies');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const passwordWrap = document.getElementById('passwordWrap');
const errorMsg = document.getElementById('errorMsg');

// Ganti password ini sesuai kebutuhan.
const CORRECT_PASSWORD = '0407';

let isOn = false;
let dragging = false;
let startX = 0;
let startY = 0;
let dragX = 0;
let dragY = 0;

function setLamp(on) {
  isOn = on;
  room.classList.toggle('on', isOn);
  if (isOn) createFireflies();
  else fireflies.innerHTML = '';
}

function updateString(x, y) {
  path.setAttribute('d', `M 0 0 L ${x} ${80 + y}`);
}

function resetHandle() {
  handle.style.transform = 'translate(0px, 0px)';
  updateString(0, 0);
}

function pointerDown(e) {
  dragging = true;
  handle.classList.add('dragging');
  startX = e.clientX;
  startY = e.clientY;
  dragX = 0;
  dragY = 0;
  handle.setPointerCapture?.(e.pointerId);
}

function pointerMove(e) {
  if (!dragging) return;
  dragX = (e.clientX - startX) * 0.3;
  dragY = Math.max(0, e.clientY - startY) * 0.6;
  dragX = Math.max(-35, Math.min(35, dragX));
  dragY = Math.min(180, dragY);
  handle.style.transform = `translate(${dragX}px, ${dragY}px)`;
  updateString(dragX, dragY);
}

function pointerUp() {
  if (!dragging) return;
  dragging = false;
  handle.classList.remove('dragging');

  const pulled = dragY > 30;
  resetHandle();

  if (pulled) setLamp(!isOn);
}

handle.addEventListener('pointerdown', pointerDown);
handle.addEventListener('pointermove', pointerMove);
handle.addEventListener('pointerup', pointerUp);
handle.addEventListener('pointercancel', pointerUp);

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createFireflies() {
  fireflies.innerHTML = '';

  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('span');
    dot.className = 'firefly';

    const size = random(3, 7);
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.setProperty('--duration', `${random(35, 65)}s`);
    dot.style.setProperty('--delay', `${random(0, 3)}s`);

    for (let n = 1; n <= 5; n++) {
      dot.style.setProperty(`--x${n}`, `${random(0, 100)}vw`);
      dot.style.setProperty(`--y${n}`, `${random(0, 100)}vh`);
    }

    fireflies.appendChild(dot);
  }
}

function clearError() {
  errorMsg.classList.remove('show');
  passwordWrap.classList.remove('error');
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (passwordInput.value === CORRECT_PASSWORD) {
    clearError();
    window.location.href = 'dashboard.html';
    return;
  }

  errorMsg.classList.add('show');
  passwordWrap.classList.add('error');
  passwordWrap.classList.remove('shake');
  // restart animation
  void passwordWrap.offsetWidth;
  passwordWrap.classList.add('shake');

  passwordInput.value = '';
  passwordInput.focus();
});

passwordInput.addEventListener('input', clearError);

setLamp(false);
