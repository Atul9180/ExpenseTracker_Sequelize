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