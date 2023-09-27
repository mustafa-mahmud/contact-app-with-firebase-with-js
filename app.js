'use strict';
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

const addBtn = document.querySelector('.add-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeBtn = document.querySelector('.close-btn');
const saveBtn = document.querySelector('.save-btn');
const form = document.querySelector('form');
const msg = document.querySelector('.msg');
const contactList = document.getElementById('contact-list');
const showContact = document.querySelector('.show-contact');

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
    getContacts();
  } catch (error) {
    initValue();

    showMsg({
      cls: 'danger',
      text: error.message + '. Pls try later...',
    });
  }
};

const getContacts = async () => {
  try {
    const docRef = collection(db, 'contact');
    const contacts = await getDocs(docRef);
    contactList.innerHTML = '';

    contacts.forEach((contact) => {
      const listItem = `
			<li class="contact-list-item" data-id="${contact.id}">
            <div class="media">
              <div class="two-letters">${contact.data().fName[0]}${
        contact.data().lName[0]
      }</div>
            </div>
            <div class="content">
              <div class="title">${contact.data().fName} ${
        contact.data().lName
      }</div>
              <div class="subtitle">${contact.data().email}</div>
            </div>
            <div class="action">
              <button class="edit-user">edit</button>
              <button class="delete-user">delete</button>
            </div>
          </li>
			`;

      contactList.innerHTML += listItem;
    });
  } catch (error) {
    showMsg({ cls: 'danger', text: `${error.message}. Something wrong...` });
  }
};

const singleContact = async (id) => {
  try {
    const docRef = doc(db, 'contact', id);
    const contact = await getDoc(docRef);

    const userInfo = {
      Name: `${contact.data().fName} ${contact.data().lName}`,
      Age: contact.data().age,
      Phone: contact.data().phone,
      Email: contact.data().email,
    };

    showContact.innerHTML = ``;

    Object.keys(userInfo).forEach((item) => {
      showContact.innerHTML += `
			<div>
				<h3 class="subject">${item}:</h3>
				<p class="info">${userInfo[item]}</p>
			</div>
			`;
    });
  } catch (error) {
    console.log(error);
  }
};

/////////////////////////////////////////////////////////
getContacts();
addBtn.addEventListener('click', addButtonPressed);
closeBtn.addEventListener('click', closeButtonPressed);
modalOverlay.addEventListener('click', hideModal);
form.addEventListener('submit', saveButtonPressed);
contactList.addEventListener('click', (e) => {
  const id = e.target.closest('.contact-list-item').getAttribute('data-id');

  singleContact(id);
});
