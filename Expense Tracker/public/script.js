let addexpenseinput = document.getElementById("addexpenseinput");
let addexpensedescription=document.getElementById("addexpensedescription");
let addexpensecategory=document.getElementById("addexpensecategory");
let addexpensebtn = document.getElementById("addexpensebtn");
let updateexpensebtn = document.getElementById("updateexpensebtn");

function saveToDb(event){
  event.preventDefault();
  let amount = event.target.addexpenseinput.value;
  let description = event.target.addexpensedescription.value;
  let category = event.target.addexpensecategory.value;
  let obj={amount,description,category};
  axios.post('http://localhost:4000/admin/addNewExpense', obj)
      .then((res) => {
        showexpenses(res.data.newAddedExpense);
      })
      .catch((err) => {
        console.log(err)
        document.body.innerHTML += `<h4> Server error ${err} , while saving data.  Please try after some time</h4>`;
      })        
  }
  

// DOM ContentLoader on page load
document.addEventListener("DOMContentLoaded", () => {
  axios.get('http://localhost:4000/admin/getAllExpenses')
      .then((res) => {
        for (var i = 0; i < res.data.allExpenses.length; i++) {
          showexpenses(res.data.allExpenses[i]);
        }
      })
      .catch((err) => {
        document.body.innerHTML += `Error in getting record:  ${err}`;
      })
  })


// showexpenses
function showexpenses(expenseItem){
  document.getElementById("addexpenseinput").value="";
  document.getElementById("addexpensedescription").value="";
  document.getElementById("addexpensecategory").value="";
  const addedexpenselist = document.getElementById("addedexpenselist");
  const html = `<tr id='${expenseItem.id}'>
                  <td>Rs ${expenseItem.amount}    |   ${expenseItem.description}   |    ${expenseItem.category}</td>
                  <td><button type="button" onclick=editexpense('${expenseItem.id}','${expenseItem.amount}','${expenseItem.description}','${expenseItem.category}') class="expbtns text-primary">Edit</button></td>
                  <td><button type="button" onclick=deleteexpense('${expenseItem.id}') class="expbtns2 text-danger">Delete</button></td>
              </tr>`;    
  addedexpenselist.innerHTML += html;
}

// editexpense
function editexpense(expId,expAmount,expDesc,expCat){
          
  addexpenseinput.value = expAmount;
  addexpensedescription.value=expDesc;
  addexpensecategory.value=expCat;
  removeExpenseFromScreen(expId);

  document.querySelector("#addexpensebtn").style.display="none";
  document.querySelector("#updateexpensebtn").style.display="block";
  updateexpensebtn.setAttribute("onclick",`updateUser('${expId}')`)
}

//update in crud crud
function updateUser(expId){
  amount = addexpenseinput.value;
  description = addexpensedescription.value;
  category = addexpensecategory.value;
  obj={amount,description,category};
  axios.put(`http://localhost:4000/admin/updateExpense/${expId}`, obj)
      .then((res) => {
        amount = "";
        description = "";
        category = "";
  document.querySelector("#addexpensebtn").style.display="block";
  document.querySelector("#updateexpensebtn").style.display="none";
  updateexpensebtn.removeAttribute("onclick");
  axios.get(`http://localhost:4000/admin/getExpenseById/${expId}`)
      .then((res) => { console.log(res.data.updatedUserExpense)
        showexpenses(res.data.updatedUserExpense); })
      .catch((err) => {
        console.log(err)
        document.body.innerHTML += `<h4> Server error ${err} , while getting updated data.  Please try after some time</h4>`;
      })
  }) 
  .catch((er) => {
      //console.log(er)
      document.body.innerHTML += `<h4> Server error ${er} , while updating.  Please try after some time</h4>`;
      })

}


//remove from screen
function removeExpenseFromScreen(expId){
  var remExpense=document.getElementById(expId);
  if(remExpense){
      remExpense.parentNode.removeChild(remExpense);
  }
}


// deleteexpense from crudcrud
function deleteexpense(expId){
  axios.delete(`http://localhost:4000/admin/deleteExpense/${expId}`)
      .then((res) => { removeExpenseFromScreen(expId); })
      .catch((err) => {
        document.body.innerHTML += `<h4>${err} , while deleting data.Refresh(press F5 button) Page and try again.</h4>`;
      })
}