const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const particlesArray = [];
const numberOfParticles = 300;
let mouse = { x: null, y: null };
window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.trailLength = Math.random() * 20 + 10;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.02 + 0.01;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size + this.trailLength
    );
    gradient.addColorStop(0, `${this.color}`);
    gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.angle += 0.01;
    this.x += this.directionX * (1 / this.size);
    this.y += this.directionY * (1 / this.size);
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150) {
        this.x -= dx * 0.02;
        this.y -= dy * 0.02;
      }
    }
    this.draw();
  }
}
function init() {
  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * (canvas.width - size * 2) + size;
    const y = Math.random() * (canvas.height - size * 2) + size;
    const directionX = Math.random() * 0.4 - 0.2;
    const directionY = Math.random() * 0.4 - 0.2;
    const color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 0.5 + 0.5})`; // Lighter colors for visibility
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradientOverlay = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradientOverlay.addColorStop(0, `rgba(10, 10, 10, 0.1)`);
  gradientOverlay.addColorStop(1, `rgba(255, 255, 255, 0.1)`);
  ctx.fillStyle = gradientOverlay;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  requestAnimationFrame(animate);
}
init();
animate();
document.querySelectorAll('.reveal').forEach((element) => {
  element.style.opacity = 0;
  element.style.transform = 'translateY(20px)';
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.transition = 'all 0.6s ease';
    }
  });
});
document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});
function calculate() {
  var dateInput = document.getElementById("date").value;
  var objectName = document.getElementById("object").value;
  if (!dateInput || !objectName) {
    alert("Please fill in both the date and object fields.");
    return;
  }
  window.location.href = `/plot_page?datetime=${encodeURIComponent(dateInput)}&object=${encodeURIComponent(objectName)}`;
}