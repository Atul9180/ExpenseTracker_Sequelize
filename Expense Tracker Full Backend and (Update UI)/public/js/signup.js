document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.nameInput.value;
  const email = e.target.emailInput.value;
  const password = e.target.passwordInput.value;
  if (!name || !email || !password) {
    document.querySelector("#errorAlert").innerText = "All fields mandatory.!";
    alertAwakeSleep();
    return;
  }
  addNewUser(name, email, password);
});



// function to request post data to db
async function addNewUser(name, email, password) {
  try {
    const obj = { name, email, password };
    const response = await axios.post("http://localhost:4000/user/signup", obj);
    if (response.status === 201) {
      document.querySelector("#successAlert").innerText = `${response.data.UserAddedResponse}`;
      successAlertAwakeSleep();
      
      window.location.href = "/public/view/login.html";
    } else {
      throw new Error("Error creating user");
    }
  } catch (err) {
    document.querySelector("#errorAlert").innerText = `${err.response.data.message}`;
    alertAwakeSleep();
  }
}




// function to awake/sleep alert
function alertAwakeSleep() {
  document.querySelector("#errorAlert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("errorAlert").classList.toggle("hidden");
  }, 1500);
}

 function successAlertAwakeSleep() {
  document.querySelector("#successAlert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("successAlert").classList.toggle("hidden");
  }, 2000);
}
