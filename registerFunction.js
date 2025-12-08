const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const gender = document.getElementById('gender');
const dob = document.getElementById('dob');
const trn = document.getElementById('trn');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPass = document.getElementById('confirmPass');
const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');

function calculateAge(dobValue) {
    const birthDate = new Date(dobValue);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function registerUser() {

    const newUser = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        gender: gender.value,
        phone: phone.value.trim(),
        dob: dob.value,
        trn: trn.value.trim(), 
        password: password.value.trim(),
        dateRegistered: new Date().toISOString(),
        cart: {},
        invoices: []
    };

    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // unique TRN
    if (users.some(u => u.trn === newUser.trn)) {
        alert("This TRN is already registered.");
        return false;
    }

    // unique email
    if (users.some(u => u.email === newUser.email)) {
        alert("This email is already registered.");
        return false;
    }

    users.push(newUser);
    localStorage.setItem("RegistrationData", JSON.stringify(users));
    return true;
}

function checkInputs() {

    // empty check
    if (
        firstName.value.trim() === "" ||
        lastName.value.trim() === "" ||
        email.value.trim() === "" ||
        gender.value === "" ||
        phone.value.trim() === "" ||
        dob.value === "" ||
        trn.value.trim() === "" ||
        password.value.trim() === "" ||
        confirmPass.value.trim() === ""
    ) {
        alert("All fields must be filled out.");
        return false;
    }

    // password length
    if (password.value.length < 8) {
        alert("Password must be at least 8 characters.");
        return false;
    }

    // password match
    if (password.value !== confirmPass.value) {
        alert("Passwords do not match.");
        return false;
    }

    // email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        alert("Invalid email format.");
        return false;
    }

    // age check
    if (calculateAge(dob.value) < 18) {
        alert("You must be at least 18 years old.");
        return false;
    }

    // TRN format 000-000-000
    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn.value.trim())) {
        alert("TRN must be in the format 000-000-000.");
        return false;
    }

    return true;
}

function redirect() {
    window.location.href = "loginPg.html";
}

registerBtn.addEventListener('click', function(event){
    event.preventDefault();

    if (!checkInputs()) return;

    if (registerUser()) {
        alert("Registration Successful!");
        registerForm.reset();
        redirect();
    }
});
