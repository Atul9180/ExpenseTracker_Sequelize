document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.nameInput.value;
  const email = e.target.emailInput.value;
  const password = e.target.passwordInput.value;
  if (!name || !email || !password) {
    document.querySelector("#Output").innerText = "All fields mandatory.!";
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
      //console.log("server returned 201",response.data.UserAddedResponse)
      document.querySelector(
        "#Output"
      ).innerText = `${response.data.UserAddedResponse}`;
      alertAwakeSleep();
      window.location.href = "/public/view/login.html";
    } else {
      throw new Error("Error creating user");
    }
  } catch (err) {
    //console.error(err.response.data.message);
    document.querySelector(
      "#Output"
    ).innerText = `${err.response.data.message}`;
    alertAwakeSleep();
  }
}



// function to awake/sleep alert
function alertAwakeSleep() {
  document.querySelector("#error-alert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("error-alert").classList.toggle("hidden");
  }, 1500);
}
