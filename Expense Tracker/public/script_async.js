let addexpenseinput = document.getElementById("addexpenseinput");
let addexpensedescription = document.getElementById("addexpensedescription");
let addexpensecategory = document.getElementById("addexpensecategory");
let addexpensebtn = document.getElementById("addexpensebtn");
let updateexpensebtn = document.getElementById("updateexpensebtn");

async function saveToDb(event) {
  event.preventDefault();
  let amount = event.target.addexpenseinput.value;
  let description = event.target.addexpensedescription.value;
  let category = event.target.addexpensecategory.value;
  const obj = { amount, description, category };
  try{
    const res = await axios.post("http://localhost:4000/admin/addNewExpense", obj);
      showexpenses(res.data.newAddedExpense);
      document.getElementById("insertion-alert").classList.toggle("hidden");
      setTimeout(function() {
        document.getElementById("insertion-alert").classList.toggle("hidden");
      }, 2000);
    }
  catch(err){
      console.log(err);
      document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in inserting data to Db. Please Retry.`;
      document.querySelector('#error-alert').classList.toggle("hidden")
    };
}




document.addEventListener("DOMContentLoaded", async () => {
  try{
    const res = await axios.get("http://localhost:4000/admin/getAllExpenses");
      for (var i = 0; i < res.data.allExpenses.length; i++) 
              showexpenses(res.data.allExpenses[i]);
    }
  catch(err) {
    document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in fetching data. Please Refresh the Page.`;
    document.querySelector('#error-alert').classList.toggle("hidden")
    }
});



// showexpenses
async function showexpenses(expenseItem) {
  document.getElementById("addexpenseinput").value = "";
  document.getElementById("addexpensedescription").value = "";
  document.getElementById("addexpensecategory").value = "";
  const addedexpenselist = document.getElementById("addedexpenselist");
  try{
    const html = `<tr id="${expenseItem.id}" class="text-gray-600 text-sm hover:bg-gray-100">
      <td class="py-2 px-3 border-b border-gray-400">Rs ${expenseItem.amount}</td>
      <td class="py-2 px-3 border-b border-gray-400">${expenseItem.description}</td>
      <td class="py-2 px-3 border-b border-gray-400">${expenseItem.category}</td>
      <td class="py-2 px-3 border-b border-gray-400 flex items-center justify-center">
      <button onclick="editexpense('${expenseItem.id}','${expenseItem.amount}','${expenseItem.description}','${expenseItem.category}')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline">Edit</button>
      <button onclick="deleteexpense('${expenseItem.id}')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outlin">Delete</button>
      </td>
    </tr>`;
  addedexpenselist.innerHTML += html;
}
catch(err){
  document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in getting expenses data on screen. Please Refresh the Page.`;
  document.querySelector('#error-alert').classList.toggle("hidden")
  }
}



// editexpense
function editexpense(expId, expAmount, expDesc, expCat) {
  addexpenseinput.value = expAmount;
  addexpensedescription.value = expDesc;
  addexpensecategory.value = expCat;
  removeExpenseFromScreen(expId);
  document.querySelector("#addexpensebtn").style.display = "none";
  document.querySelector("#updateexpensebtn").style.display = "block";
  updateexpensebtn.setAttribute("onclick", `updateUser('${expId}')`);
}



//update in Db
async function updateUser(expId) {
  let amount = addexpenseinput.value;
  let description = addexpensedescription.value;
  let category = addexpensecategory.value;
  const obj = { amount, description, category };
  try{
    const res1 = await axios.put(`http://localhost:4000/admin/updateExpense/${expId}`, obj);
      if(res1){
      document.getElementById("updation-alert").classList.toggle("hidden");
      setTimeout(function() {
        document.getElementById("updation-alert").classList.toggle("hidden");
      }, 2000);
      }
      amount = "";
      description = "";
      category = "";
      document.querySelector("#addexpensebtn").style.display = "block";
      document.querySelector("#updateexpensebtn").style.display = "none";
      updateexpensebtn.removeAttribute("onclick");
    }
    catch(err){
      console.log(err);
      document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in updating data. Please Refresh the Page.`;
      document.querySelector('#error-alert').classList.toggle("hidden")
    }
  try{
    const result2 = await axios.get(`http://localhost:4000/admin/getExpenseById/${expId}`)
          showexpenses(result2.data.updatedUserExpense);
    }
    catch(err){
          console.log(err);
          document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in getting updated data. Please Refresh the Page.`;
          document.querySelector('#error-alert').classList.toggle("hidden")
        }
  }



//remove from screen
async function removeExpenseFromScreen(expId) {
  try {
    const remExpense = document.getElementById(expId);
    remExpense.parentNode.removeChild(remExpense);
  } catch (err) {
    console.log(err);
    document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in removing data from screen. Please Refresh the Page.`;
    document.querySelector('#error-alert').classList.toggle("hidden")
  }
}



// deleteexpense from crudcrud
async function deleteexpense(expId) {
  try{
    await axios.delete(`http://localhost:4000/admin/deleteExpense/${expId}`)
    removeExpenseFromScreen(expId);    
      document.getElementById("deletion-alert").classList.toggle("hidden");
      setTimeout(function() {
        document.getElementById("deletion-alert").classList.toggle("hidden");
      }, 2000);
    }
  catch(err){
      console.log('error form delete request',err)
      document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in deleting.Please Refresh the Page.`;
      document.querySelector('#error-alert').classList.toggle("hidden")
    }
}

// err-alert close button:
document.getElementById("close-button").addEventListener("click", function() {
  document.getElementById("alert").remove();
  window.location.reload();
});
