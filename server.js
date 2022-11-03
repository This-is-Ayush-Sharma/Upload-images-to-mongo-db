// upload.js
const express = require('express')
const multer  = require('multer')
//importing mongoose schema file
const Upload = require("./models/Upload");
const app = express()
//setting options for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

app.set('view engine','ejs');

app.use(express.json());
app.use(cors());
// Body-parser middleware
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

mongoose.connect('mongodb://localhost:27017/imageData',()=>{
    console.log("connected to db");
})

app.get('/',(req,res)=>{
    return res.render('upload');
})

app.post("/upload", upload.single("avatar"), async (req, res) => {
    // req.file can be used to access all file properties
    try {
      //check if the request has an image or not
      if (!req.file) {
        res.json({
          success: false,
          message: "You must provide at least 1 file"
        });
      } else {
        // console.log(req.file.buffer.toString('base64'));
        let imageUploadObject = {
          file: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          },
          fileName: req.file.originalname
        };
        // console.log(imageUploadObject);
        await Upload.create(imageUploadObject);
        // const uploadObject = new Upload(imageUploadObject);
        // // saving the object into the database
        // const uploadProcess = await uploadObject.save();
        res.status(200).json({
          message:'file uploaded sucessfully!'
        })
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });


app.get('/fetch',async(req,res)=>{
  const datas = await Upload.find();
  // console.log(datas);
  res.render('view',{
      datas
  })
});
app.listen(5000);