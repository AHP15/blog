const form = document.querySelector('form');

const token = fetch('/csrf-token').then(res => res.json());
token.then(({token}) => {
  const tokenInput = document.createElement('input');
  tokenInput.setAttribute('value', token);
  tokenInput.setAttribute('name', 'token');
  tokenInput.hidden = true;
  form.appendChild(tokenInput);
});

const inputs = form.querySelectorAll('input')

inputs.forEach(input => input.addEventListener('invalid', (event) => {
  console.log(event);
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (Array.from(inputs).some(input => input.value !== '')) {
    form.submit();
  }
});