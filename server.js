const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { v4: uuidv4 } = require('uuid');

const fs = require('fs')
const multer =require('multer')
const path=require('path');
const directory = './public/franchiseImages';
var fname = null




const storage=multer.diskStorage({
        destination:function(req,file,cb){
                //define the directory
                cb(null,directory);
        },
        filename:function(req,file,cb){
                fname = uuidv4() +file.originalname
                cb(null,fname);
        }
});
const upload=multer({storage:storage});

const app = express()


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/franchiseImages')));

//body-parser
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//cors
app.use(cors())

//import db connection
require('./connection')

//import schema and model
const {
    Franchise
} = require('./schema')


//upload images
app.post('/franchise', upload.single('franchiseImage'), (req, res) => {
    let {
        franchiseName,
        franchiseAltitude,
        franchiseLatitude,
        franchiseDescription
    } = req.body

    let addFranchise = async () => {
        const franchise = new Franchise({
            franchiseName: franchiseName,
            franchiseAltitude: franchiseAltitude,
            franchiseImagePath: fname,
            franchiseLatitude: franchiseLatitude,
            franchiseDescription: franchiseDescription
        })

        const result = await franchise.save()
        console.log(result.franchiseImagePath)
    }

    addFranchise()

    res.end('Data saved')
})


//get all franchises
app.get('/allfranchises', (req, res) => {

    Franchise.find().then(resp => res.status(200).json({ 'data': resp }))
    .catch(err => console.log(err.message))
})

//find by id 
app.get('/franchisefindbyid/:id', (req, res) => {

    Franchise.findById(req.params.id).then(resp => {
        res.status(200).json({ 'data': resp })
        res.end()
    })
    .catch(err => console.log(err.message))
})

//update offer by id 
app.put('/updatefranchisebyid/:id', upload.single('franchiseImage') , (req, res) => {

    let {
        franchiseName,
        franchiseAltitude,
        franchiseLatitude,
        franchiseDescription
    } = req.body

    console.log("files orignal name",req.file)

    let updateFranchise = async () => {

        const result_franchise = await Franchise.findById(req.params.id)
        if (!result_franchise) return
        else if (req.file === undefined) {
        result_franchise.franchiseName = franchiseName
        result_franchise.franchiseAltitude = franchiseAltitude
        result_franchise.franchiseImagePath = result_franchise.franchiseImagePath
        result_franchise.franchiseLatitude = franchiseLatitude
        result_franchise.franchiseDescription = franchiseDescription
        }
        else {
            
        fs.unlink("D:/code/project/backend/franchise service/public/franchiseImages" + "/" + result_franchise.franchiseImagePath, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });

        result_franchise.franchiseName = franchiseName
        result_franchise.franchiseAltitude = franchiseAltitude
        result_franchise.franchiseImagePath = fname
        result_franchise.franchiseLatitude = franchiseLatitude
        result_franchise.franchiseDescription = franchiseDescription

        }
        

        const updatedResult = await result_franchise.save()

        console.log(updatedResult)
    }

    updateFranchise()

    res.end('Data Updated')
})


//find by id and delete 
app.delete('/deletefranchisebyid/:id', (req, res) => {

    let getFranchiseByID = async () => {
        const result_franchise = await Franchise.findById(req.params.id)

        if(result_franchise)
        fs.unlink("D:/code/project/backend/franchise service/public/franchiseImages" + "/" + result_franchise.franchiseImagePath, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
        

        const deletedResult = await Franchise.deleteOne({
            _id: req.params.id
        })
        console.log(deletedResult)
    }

    getFranchiseByID()

    res.end('Data Deleted')
})


app.listen(3333, () => console.log('server started...'))