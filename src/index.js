import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, query, where,
    orderBy, serverTimestamp, getDoc,
    updateDoc, getDocs, getDocFromCache, update,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC-Dhyv_UTzJwroSPF5GVpPBiI7zY5yVqM",
    authDomain: "daxoppgave-89c74.firebaseapp.com",
    projectId: "daxoppgave-89c74",
    storageBucket: "daxoppgave-89c74.appspot.com",
    messagingSenderId: "600593149477",
    appId: "1:600593149477:web:22e1345e361ad971da59cc"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();
const counterID = 'WLa6PHZ2KkIpX89fYbQn';
const loginDB = collection(db, 'logins');
const counterDB = collection(db, 'counter');
const inputsDB = collection(db, 'inputs');
const counterDocRef = doc(db, 'counter', counterID);

const loginScreen = document.getElementById('loginScreen');
const usernameElement = document.getElementById('username');
const counterElement = document.getElementById('counter');
const logout = document.getElementById('logout');
const plusMinus = document.getElementById('plus-minus');
const homeScreen = document.getElementById('homeScreen');
const inputOutputField = document.getElementById('inputOutputField');

async function getQuery(q, q2) {
    const querySnapshot = await getDocs(q, q2);
}

logout.addEventListener('click', e => {
    location.reload()
});

onSnapshot(counterDB, snapshot => {
    let counters = [];
    snapshot.docs.forEach(doc => {
        counters.push({ ...doc.data(), id: doc.id })
    })
    counterElement.innerText = counters[0].value
})

let q = query(inputsDB, orderBy('created_at', 'asc'))
onSnapshot(q, snapshot => {
    let inputs = [];
    snapshot.docs.forEach(doc => {
        inputs.push({ ...doc.data(), id: doc.id })
    })
    inputOutputField.innerHTML = '';
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i].input;
        let id = inputs[i].id
        outputInputs(input, id);
    }
})

plusMinus.addEventListener('click', e => {
    const emitter = e.target.textContent;
    switch (emitter) {
        case '+':
            updateDoc(counterDocRef, { value: parseInt(counterElement.innerText) + 1 })
            break;
        case '-':
            if (counterElement.innerText > 0) {
                updateDoc(counterDocRef, { value: parseInt(counterElement.innerText) - 1 })
            }
            break;
        default:
            break;
    }
})

const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', e => {
    e.preventDefault();
    if (signupForm.email.value && signupForm.password.value) {
        const user = signupForm.email.value;
        const pass = signupForm.password.value;
        let q = query(loginDB, where("password", "==", pass))
        let q2 = query(loginDB, where("username", "==", user))
        getQuery(q, q2)
        onSnapshot(q, q2, snapshot => {
            let logins = [];
            snapshot.docs.forEach(doc => {
                logins.push({ ...doc.data(), id: doc.id })
            });
            const password = logins[0].password
            const username = logins[0].username
            if (pass === password && user === username) {
                homeScreen.classList.toggle('hidden');
                loginScreen.classList.toggle('hidden');
                usernameElement.innerText = username;
            }
        });
    }
});

const inputForm = document.getElementById('inputForm');
inputForm.addEventListener('submit', e => {
    e.preventDefault();
    addDoc(inputsDB, {
        input: inputForm.input.value,
        created_at: serverTimestamp()
    })
    inputForm.reset()
});

function outputInputs (input, id) {
    const html = `
    <div class="card ms-4 me-4 mt-2" id="${id}">
        <div class="card-body">
        ${input}
        </div><button class="delete btn btn-danger" onclick="deleteInput();">X</button>
    </div>
    `
    inputOutputField.innerHTML += html;
}

function deleteInput (e) {
    console.log(e)
}