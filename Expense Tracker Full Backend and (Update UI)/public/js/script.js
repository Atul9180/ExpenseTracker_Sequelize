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
      document.getElementById("success-alert").innerText = "Expense added Successfully!"
      awakeSuccessAlert();
    }
  catch(err){
      console.log(err);
      document.querySelector('.error-textMsg').innerText=`Server error- ${err} ,in inserting data to Db. Please Retry.`;
      document.querySelector('#error-alert').classList.toggle("hidden")
    };
}



// DOM ContentLoader on page load
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
      <button onclick="editexpense('${expenseItem.id}','${expenseItem.amount}','${expenseItem.description}','${expenseItem.category}')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2 "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
      <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
    </button>
      <button onclick="deleteexpense('${expenseItem.id}')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded  "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
    </button>
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
      document.getElementById("success-alert").innerText="Expense Updation Successful.";
      awakeSuccessAlert();
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
    document.getElementById("deletion-alert").innerText="Expense deleted Successfully!";
    awakeDeletedAlert();
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

//alert awake and sleep
function awakeSuccessAlert(){
  document.getElementById("success-alert").classList.toggle("hidden");
  setTimeout(function() {
    document.getElementById("success-alert").classList.toggle("hidden");
  }, 1500);
}

//deleted alert
function awakeDeletedAlert(){
  document.getElementById("deletion-alert").classList.toggle("hidden");
      setTimeout(function() {
        document.getElementById("deletion-alert").classList.toggle("hidden");
      }, 1500);
}