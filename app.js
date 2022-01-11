const express = require('express')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')
const AWS = require('aws-sdk')//TODO 
const app = express()
app.use(cors())

AWS.config.update({
    accessKeyId: 'TU_ID',
    secretAccessKey: 'TU_SECRET',
    region: "us-west-2" //TODO
});

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const port = process.env.PORT || 3000

const storage = multer.diskStorage(
    {
        destination: function(req, file, cb){
            cb(null,'./uploads')
        },
        filename: function(req, file, cb){
            cb(null,file.originalname)
        }
    }
)

const upload = multer({storage})

/**
 * //TODO Definir ruta port para subir imagen
 */

app.post(`/upload`,upload.single('myfile'),(req, res) => {
    const {originalname, path} = req.file;
    const bodyFile = fs.createReadStream(path);
    const paramsSnap = {
        Bucket: 'TU_BUCKETNAME',
        Key: originalname,
        Body: bodyFile,
        ContentType: 'image/png',
        ACL: 'public-read',//TODO 😎
    };

    s3.upload(paramsSnap, function (err, data) {
        if (err) {
            console.log('error in callback',err);
        } else {
            console.log(data)
           
            res.send(data)    
        }
    });



})




app.listen(port, () => {
    console.log('Estamos ready por el puerto', port)
})