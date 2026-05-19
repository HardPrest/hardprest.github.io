// Spider-like cursor trails reaching toward fixed anchor points
console.log('Website loaded successfully');

const canvas = document.getElementById('motion-bg');
const ctx = canvas.getContext('2d');
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('Button clicked');
  });
});

const mouse = { x: 0, y: 0, active: false };
const anchors = [];
const settings = {
  gridRows: 10,
  gridCols: 20,
  maxReach: 320,
  maxConnections: 6,
  pulsate: 0.004,
};

const resizeCanvas = () => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  initializeAnchors();
};

const initializeAnchors = () => {
  anchors.length = 0;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const spacingX = width / (settings.gridCols + 1);
  const spacingY = height / (settings.gridRows + 1);

  for (let row = 1; row <= settings.gridRows; row += 1) {
    const rowOffset = (row % 2 === 0) ? spacingX / 2 : 0;
    for (let col = 1; col <= settings.gridCols; col += 1) {
      anchors.push({
        x: spacingX * col + rowOffset,
        y: spacingY * row,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }
};

const drawWebTrails = (time) => {
  if (!mouse.active) return;

  const activeAnchors = anchors
    .map(anchor => {
      const dx = mouse.x - anchor.x;
      const dy = mouse.y - anchor.y;
      const distance = Math.hypot(dx, dy);
      const strength = Math.max(0, 1 - distance / settings.maxReach);
      return { anchor, dx, dy, distance, strength };
    })
    .filter(item => item.strength > 0.05)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, settings.maxConnections);

  activeAnchors.forEach((item, index) => {
    const { anchor, dx, dy, strength } = item;
    const pulse = Math.sin(time * settings.pulsate + anchor.offset) * 8;
    const controlX = anchor.x + dx * 0.22 + Math.cos(anchor.offset + time * 0.003) * pulse;
    const controlY = anchor.y + dy * 0.22 + Math.sin(anchor.offset - time * 0.003) * pulse;
    const endX = mouse.x;
    const endY = mouse.y;

    ctx.strokeStyle = `rgba(255, 170, 255, ${0.08 + strength * 0.38})`;
    ctx.lineWidth = 1 + strength * 1.2;
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + strength * 0.06})`;
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
};

const drawBackground = (time) => {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawWebTrails(time);
};

const animate = (timestamp) => {
  drawBackground(timestamp);
  requestAnimationFrame(animate);
};

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', event => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
  mouse.active = true;
});
window.addEventListener('mouseout', () => {
  mouse.active = false;
});

resizeCanvas();
animate();
