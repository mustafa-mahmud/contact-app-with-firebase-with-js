'use strict';
import {
  getFirestore,
  addDoc,
  collection,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

const addBtn = document.querySelector('.add-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeBtn = document.querySelector('.close-btn');
const saveBtn = document.querySelector('.save-btn');
const form = document.querySelector('form');
const msg = document.querySelector('.msg');

const db = getFirestore();
const dbRef = collection(db, 'contact');

const addButtonPressed = () => {
  modalOverlay.style.display = 'flex';
};

const initValue = () => {
  document.querySelector('input[name="fName"]').value = '';
  document.querySelector('input[name="lName"]').value = '';
  document.querySelector('input[name="age"]').value = '';
  document.querySelector('input[name="phone"]').value = '';
  document.querySelector('input[name="email"]').value = '';
};

const closeButtonPressed = () => {
  modalOverlay.style.display = 'none';
};

const hideModal = (e) => {
  if (!e.target.closest('.modal')) closeButtonPressed();
};

const showMsg = ({ cls, text }) => {
  msg.classList.add(cls);
  msg.textContent = text;

  setTimeout(() => {
    hideMsg();
  }, 3000);
};

const hideMsg = () => {
  closeButtonPressed();

  msg.className = 'msg';
  msg.textContent = '';

  saveBtn.disabled = false;
};

const saveButtonPressed = async (e) => {
  e.preventDefault();

  saveBtn.disabled = true;

  try {
    await addDoc(dbRef, {
      fName: document.querySelector('input[name="fName"]').value,
      lName: document.querySelector('input[name="lName"]').value,
      age: document.querySelector('input[name="age"]').value,
      phone: document.querySelector('input[name="phone"]').value,
      email: document.querySelector('input[name="email"]').value,
    });

    initValue();
    showMsg({ cls: 'success', text: 'Contact added successfully' });
  } catch (error) {
    console.log(error);
    showMsg({
      cls: 'danger',
      text: 'Contact does not added, Pls try later...',
    });
  }
};

////////////////////////////////////////////////////////////////
addBtn.addEventListener('click', addButtonPressed);
closeBtn.addEventListener('click', closeButtonPressed);
modalOverlay.addEventListener('click', hideModal);
form.addEventListener('submit', saveButtonPressed);
