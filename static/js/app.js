'use strict';
//Starting Registration From Scripts
console.log('hello World');
let appName = document.querySelector('#required-name');
let appUsername = document.querySelector('#required-username');
let appEmail = document.querySelector('#required-email');
let appPassword = document.querySelector('#required-password');
let appConfirmPassword = document.querySelector('#required-confirmPassword');
let button = document.querySelector('#RegisterAnimation');
let loginButton = document.querySelector('#loginAnimation');
let passwordVText = document.querySelector('#passwordVText');

let isClickedOnLogin = false;
let isClickedOnRegister = false;

//Animation for Login Button
function showAnimation() {
  !isClickedOnLogin ? button.classList.remove('hidden') : button.classList.add('hidden');
  isClickedOnLogin = !isClickedOnLogin;
}

//Animation for Register Button
function showLoginAnimation() {
  !isClickedOnRegister ? loginButton.classList.remove('hidden') : loginButton.classList.add('hidden');
  isClickedOnRegister = !isClickedOnRegister;
}

//Show if password matched
function checkPassword() {
  console.log(passwordVText);
  if(appPassword.value === appConfirmPassword.value) {
    passwordVText.classList.remove('hidden', 'text-red-900');
    passwordVText.classList.add('text-green-500')
    passwordVText.innerText = "Valid Password";
  } else {
    passwordVText.classList.remove('hidden', 'text-green-900');
    passwordVText.classList.add('text-red-900')
    passwordVText.innerText = "Password does not match";
  }
}
//Ending Registration From Data

//Cart Function
let cartHidden =  true;
let cartid = document.querySelector('#cart')
function openCart() {
  cartHidden ? cartid.classList.remove('hidden') : cartid.classList.add('hidden');
  cartHidden = !cartHidden;
}