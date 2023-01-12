
document.querySelector("#forgetPasswordForm").addEventListener("submit", async (e)=>{
    try{
    e.preventDefault();
    const email = e.target.email.value;
    if(!email){ return alert('Please enter your correct email')}
    const result = await axios.post("http://localhost:4000/password/forgotPassword", {email})
    console.log(result.data.message)
    //notification(res.data.message);
    document.getElementById("email").value="";
    }
    catch(err){
      console.log(err)
      //notification(err);
      throw new Error(err)
    }
  })