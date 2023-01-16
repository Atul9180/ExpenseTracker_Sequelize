async function forget(e){
  try{
      e.preventDefault();
      const email = document.getElementById('email').value;
    
    if(!email){ return alert('Please enter your correct email')}
    const result = await axios.post("http://localhost:4000/password/forgotpassword", {email})
    console.log(result.data)
    //notification(res.data.message);
    document.getElementById('email').value="";
    document.body.innerHTML += `<div style="color:green;">${result.data.message}
    <div>`
    }
    catch(err){
      console.log(err)
      //notification(err);
      document.body.innerHTML += '<div style="color:red;">${err} <div>'
    }
  }



//   // document.querySelector("#passwordreset-form").addEventListener("subbmit", async (e)=>{
//   //   e.preventDefault();
//   //   try{
//   //     const password = e.target.newPassword.value;
//   //     console.log("new passowrd entered by user is: ",password);
//   //     const res = await axios.post("http://localhost:4000/password/resetpassword/:id",{password})


//   //   }
//   //   catch(err){
//   //     console.log("error in reset passsword is: ",error)
//   //     throw new Error(err)
//   //   }
//   // })