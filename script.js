// Mobile-ready JavaScript starter

console.log('Website loaded successfully');

// Example button interaction
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('Button clicked');
  });
});