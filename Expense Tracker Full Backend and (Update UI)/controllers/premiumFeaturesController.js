const Expense = require("../model/expensesModel");
const User = require("../model/usersModel");
const Downloads = require('../model/downloadedReportsModel')
const sequelize = require("sequelize");

const AWS = require('aws-sdk')


const getLeadersData = async (req, res) => {
  try {
    const leadersExpenses = await User.findAll({
      attributes: [
        "name",
        [
          sequelize.fn(
            "coalesce",
            sequelize.fn("SUM", sequelize.col("user_expenses_tbs.amount")),
            0
          ),
          "aggregate_amount",
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
          required: false,
        },
      ],
      group: ["users_tb.id"],
      order: [[sequelize.literal("aggregate_amount"), "DESC"]],
    });
    res.json(leadersExpenses);
  } catch (err) {
    console.log("Error in fetching leaders data, error: ", JSON.stringify(err));
    res.status(500).json(err.message);
  }
};



const uploadToS3 = async (stringifiedExpenses,fileName)=>{
  try{
  const BUCKET_NAME=process.env.BUCKET_NAME;
  const IAM_USER_KEY=process.env.IAM_USER_ACCESS;
  const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  })
  
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,                         //define filename:
      Body: stringifiedExpenses ,
      ACL: 'public-read'            //define data to upload:
    }
   const { Location: fileUrl } = await s3bucket.upload(params).promise();
        return fileUrl;
  }
  catch(err){
    console.log("Error in uploading expenses data to S3, error: ", JSON.stringify(err));
        throw new Error(err);
  }
}


const getExpenseReport = async (req,res)=>{
  try {
    if(!req.user.ispremiumuser){
      return res.status(401).json({ success: false, message: 'User is not a premium User'})
    }
    const usersTbId = req.user.userId;
    const overAllExpenses = await Expense.findAll({where:{usersTbId}})
    if(overAllExpenses){
    const stringifiedExpenses = JSON.stringify(overAllExpenses)
   
    const fileName = `expensereport${usersTbId}/${new Date()}.json`;
    console.log("file name created is : ",fileName)
    const fileUrl = await uploadToS3(stringifiedExpenses,fileName);
      if(fileUrl){
        await Downloads.create({fileUrl,usersTbId});
        return res.status(200).json({fileUrl,success:true})   
      } 
    }
    else{
     return  res.json({message:"no data exists..",success:false})
    }
  } catch (err) {
    console.log("Error in fetching expenses data, error: ", err);
    res.status(500).json({fileUrl: '', success: false, err});
  }
}




const showUsersDownloads = async (req,res)=>{
  try {
    if(!req.user.ispremiumuser){
      return res.status(401).json({ success: false, message: 'User is not a premium User'})
   }
    const usersTbId = req.user.userId;
    const prevDownloads = await Downloads.findAll({where:{usersTbId}})
    if(prevDownloads){
      //console.log("prev downloads are <><><>: ",prevDownloads)
      return res.status(200).json({prevDownloads,success:true})     
    }
    else{
     return  res.json({message:"No previous Downloads..",success:false})
    }
  } catch (err) {
    console.log("Error in fetching previous Downloads data , error: ", err);
    res.status(500).json(err.message);
  }
}


module.exports = { getLeadersData, getExpenseReport,showUsersDownloads}



    //creates and upload .txt file on s3
// const getExpenseReport = async (req,res)=>{
//   try {
//     const usersTbId = req.user.userId;
//     const overAllExpenses = await Expense.findAll({where:{usersTbId}})
//     if(overAllExpenses){
//     const stringifiedExpenses = JSON.stringify(overAllExpenses)

//     console.log("stringified is :",stringifiedExpenses)
//     const fileName = `expensereport.txt`;
//     console.log("file name created is : ",fileName)
//     const fileUrl = await uploadToS3(stringifiedExpenses,fileName);
//     console.log("created url is: ",fileUrl)
//       return res.json({fileUrl,success:true})     
//     }
//     else{
//      return  res.json({message:"no data exists..",success:false})
//     }
//   } catch (err) {
//     console.log("Error in fetching expenses data, error: ", JSON.stringify(err));
//     res.status(500).json(err.message);
//   }
// }



    //generate xlsx file and upload json file on s3
// const getExpenseReport = async (req,res)=>{
//   try {
//     //const html = fs.readFileSync(('../public/view/report.html'),'utf-8')
//     const usersTbId = req.user.userId;
//     const totalExpenses = await Expense.findAll({where:{usersTbId}})
//     if(totalExpenses){
//       const expenseObjs = totalExpenses.map(item => {
//         return {
//             date: item.updatedAt,
//             day: item.updatedAt.getDay(),
//             month: item.updatedAt.getMonth(),
//             year: item.updatedAt.getFullYear(),
//             category: item.category,
//             description: item.description,
//             amount: item.amount,
//             //type: item.recordType
//         }
//     })

//     const convertJsonToExcel = () => {
//       const workSheet = XLSX.utils.json_to_sheet(expenseObjs)
//       const workBook = XLSX.utils.book_new()
//       //const workBook = XLSX.utils.book_new(workSheet)
//       XLSX.utils.book_append_sheet(workBook,workSheet,"expenseObjs")
//       //generate Buffer:
//       XLSX.write(workBook,{bookType:'xlsx',type:'buffer'})
//       //binary string
//       XLSX.writeFile(workBook,"expensesRecordWorkBook.xlsx")

//       const fileName = `expensesRecordWorkBook.xlsx`;
//       console.log("file name created is : ",fileName)
//     }
//     convertJsonToExcel();    
//      // Configure the AWS SDK
//      AWS.config.update({
//       accessKeyId: process.env.IAM_USER_ACCESS,
//       secretAccessKey: process.env.IAM_USER_SECRET,
//       region: 'ap-south-1'
//   });

//   const s3 = new AWS.S3();
//   const bucketName = process.env.BUCKET_NAME;

//   // Create a JSON file from the expense objects
//   const jsonFile = JSON.stringify(expenseObjs);

//   // Upload the JSON file to S3
//   const jsonParams = {
//       Bucket: bucketName,
//       Key: 'expenses.json',
//       Body: jsonFile,
//       ACL: 'public-read'
//   };
//   s3.upload(jsonParams, (err, data) => {
//       if (err) {
//           console.log(err);
//       } else {
//           const jsonUrl = data.Location;
//           console.log(`JSON file uploaded to ${jsonUrl}`);
//           // send the url of json file to frontend
//           return res.status(200).json({ jsonUrl });
//       }
//   });

//   }
//     else{
//      return  res.json({message:"no data exists..",success:false})
//     }
//   } catch (err) {
//     console.log("Error in fetching expenses data, error: ", JSON.stringify(err));
//     res.status(500).json(err.message);
//   }
// }


