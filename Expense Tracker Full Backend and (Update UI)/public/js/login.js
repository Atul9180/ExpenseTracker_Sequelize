document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;
  // console.log(email,password);
  if (!email || !password) {
    document.querySelector("#Output").innerText = `All fields are mandatory..!`;
    alertAwakeSleep();
    return;
  }
  authenticateLogin(email, password);
  //empty back form filled:
  e.target.email.value = "";
  e.target.password.value = "";
});



//user Authentication
async function authenticateLogin(email, password) {
  try {
    const obj = { email, password };
    const response = await axios.post("http://localhost:4000/user/login", obj);
    if (response.status === 200) {
      //console.log(response.data)
      alert("User login sucessful");
      document.querySelector(
        "#Output"
      ).innerText = `Hi, ${response.data.name}. Login Successful`;
      alertAwakeSleep();
      //window.location.href = "/public/view/home.html"
    } else {
      throw new Error("Error in credentials");
    }
  } catch (error) {
    //console.log(error.response.data.message)
    document.querySelector(
      "#Output"
    ).innerText = `${error.response.data.message}`;
    alertAwakeSleep();
  }
}



// function to awake/sleep alert
function alertAwakeSleep() {
  document.querySelector("#error-alert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("error-alert").classList.toggle("hidden");
  }, 3000);
}
