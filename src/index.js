import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, query, where,
    orderBy, serverTimestamp, getDoc,
    updateDoc, getDocs, getDocFromCache
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDQHYDZM2ThjWheAcsg1un4vmOiswwOMg4",
    authDomain: "daxoppgave-firebase.firebaseapp.com",
    projectId: "daxoppgave-firebase",
    storageBucket: "daxoppgave-firebase.appspot.com",
    messagingSenderId: "212979213405",
    appId: "1:212979213405:web:0768e5cc2742b0266419b4"
};

const app = initializeApp(firebaseConfig);

let checker = true;
const db = getFirestore();
const loginDB = collection(db, 'logins');
const counterDB = collection(db, 'counter');

const signInTemplate = `
<main class="form-signup w-100 m-auto position-absolute top-50 start-50 translate-middle">
    <form class="signup ms-5 me-5">
        <h1 class="h3 mb-3 fw-normal">Sign In</h1>

        <div class="form-floating">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" name="email" required>
            <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                name="password" required>
            <label for="floatingPassword">Password</label>
        </div>
        <button class="w-100 btn btn-lg btn-secondary in" type="submit" id="cbt">Sign In</button>
    </form>
</main>
`;

async function getQuery(q, q2) {
    const querySnapshot = await getDocs(q, q2);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
}

const body = document.querySelector('body');
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
                onSnapshot(counterDB, snapshot => {
                    let counters = []
                    snapshot.docs.forEach(doc => {
                        counters.push({ ...doc.data(), id: doc.id })
                    })
                    const counter = counters[0].counter
                    body.innerHTML = `
                    <h1>${username}</h1>
                    <h2>Counter: <span id="counter">${counter}</span></h2>
                    <button class="btn btn-secondary" id="add">+</button><button class="btn btn-outline-secondary" id="subtract">-</button>
                    `
                    const counterElement = document.getElementById('counter')
                    const add = document.getElementById('add')
                    const subtract = document.getElementById('subtract')
                    add.addEventListener('click', e => {
                        if(counterElement.innerText < 1){
                            console.log('too small');
                        } else {
                            
                        }
                    })
                    subtract.addEventListener('click', e => {
                        
                    })
                })
            }
        });
    }
});