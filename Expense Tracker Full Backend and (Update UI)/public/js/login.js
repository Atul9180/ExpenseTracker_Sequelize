document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  // console.log(email,password);
  if (!email || !password) {
    document.querySelector("#errorAlert").innerText = `All fields are mandatory..!`;
    alertAwakeSleep();
    return;
  }
  authenticateLogin(email, password);
  //empty back form :
  e.target.email.value = "";
  e.target.password.value = "";
});



//user Authentication
async function authenticateLogin(email, password) {
  try {
    const obj = { email, password };
    const response = await axios.post("http://localhost:4000/user/login", obj);
    if (response.status === 200) {
      //console.log("line 25 loginjs: ",response.data.user)
      alert(response.data.message);
      //console.log("loginjs line 27>>: ",response.data)
     // document.querySelector("#successAlert").innerText = `Hi, ${response.data.token}. Login Successful`;
     // successAlertAwakeSleep();
      // Set JWT as a cookie or localstorage
      //document.cookie = `jwt=${response.data.token}`;
      localStorage.setItem('token',response.data.token)
      
      // Redirect to home page
     window.location.href = "/public/view/home.html";
    } else {
      throw new Error("Error in credentials");
    }
  } catch (err) {
    //console.log("error from loginjs catch: ",err)
    document.querySelector("#errorAlert").innerText = `${err.response.data.message}`;
    alertAwakeSleep();
  }
}



// function to awake/sleep error alert
function alertAwakeSleep() {
  document.querySelector("#errorAlert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("errorAlert").classList.toggle("hidden");
  }, 3000);
}

// function to awake/sleep success alert
function successAlertAwakeSleep() {
  document.querySelector("#successAlert").classList.toggle("hidden");
  setTimeout(function () {
    document.getElementById("successAlert").classList.toggle("hidden");
  }, 3000);
}
