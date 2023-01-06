document.getElementById('signup-form').addEventListener('submit', e=>{
    e.preventDefault();

    const name = e.target.nameInput.value;
    const email = e.target.emailInput.value;
    const password = e.target.passwordInput.value;

    if(!name || !email || !password) return;
    
    addNewUser(name,email,password);
})

// async function addNewUser(name,email,password){
//     try {
//         const obj = {
//             name:name,
//             email:email,
//             password:password
//         }; 
//         const response = await axios.post("http://localhost:4000/user/signup", obj);
//         if(response.status === 201){
//           console.log("server returned 201",response.data.UserAddedResponse)
//           //document.getElementById('output').innerText = "User Created Successfully";
          
//           window.location.href = "/public/view/login.html"
//         }
//         else{
//           console.warn("server returned error: user exists")
//           document.getElementById('output').innerText = "User Already exists. Please login.";
//           throw new Error("User Already Exists");
//         }
//         // call function to show newly added expense on the screen
//        // document.getElementById('output').innerText = "User Added Successfully";
//       } catch (err) {
//           console.log("server hit error ",err);
//           document.querySelector('#output').innerText=`Server error- ${err} ,in creating new account. Please Refresh the Page.`;
//           document.querySelector('#error-alert').classList.toggle("hidden")
//       }
//     }


async function addNewUser(name,email,password){
  try {
    const obj = {
      name:name,
      email:email,
      password:password
    }; 
    const response = await axios.post("http://localhost:4000/user/signup", obj);
    if(response.status === 201){
      console.log("server returned 201",response.data.UserAddedResponse)
      window.location.href = "/public/view/login.html"
    }
    else{
      throw new Error("Error creating user");
    }
  } catch (err) {
      //console.log("server hit error ",err);
      document.querySelector('#Output').innerText= "Email Already Exists. Please Login.;"
      document.querySelector('#error-alert').classList.toggle("hidden")
  }
}
