
const sharp = require("sharp");
const aws = require('aws-sdk');
const s3 = new aws.S3();

let inputDir = 'test_files'
let outputDir = "resized_images"
let converted = "converted_images"
let convertedResized = "converted_resized_images"

const Bucket = "img-resizer-lambda"

const transforms = [
    {name: 'thumbnail', size: 10}
]

exports.handler = async (event) => {
    try {
        const data = await s3.listObjects({ Bucket: "img-resizer-lambda" }).promise();
        const files = data.Contents;
        for (const file of files) {
            const image = await s3.getObject({ Bucket: "img-resizer-lambda", Key: file.Key}).promise()
            for (const t of transforms) {
                let origName = file.Key.toString()
                let index = origName.lastIndexOf('.')
                let resizedName = "resized-"+origName
                let convertedName = "converted-"+origName.slice(0, index)+".webp"
                let resizedConvertedName = "resized-"+convertedName
                const resizedImg = await sharp(image.Body).resize(t.size).toBuffer();
                const convertedImg = await sharp(image.Body).toFormat("webp").toBuffer();
                const resizedConvertedImg = await sharp(image.Body).resize(t.size).toFormat('webp').toBuffer();
                const updatedResized = await s3.putObject({ Bucket: "img-resizer-lambda", Body: resizedImg, Key: `${outputDir}/${resizedName}`}).promise()
                const updatedConverted = await s3.putObject({ Bucket: "img-resizer-lambda", Body: convertedImg, Key: `${converted}/${convertedName}`}).promise()
                const updatedResizedConverted = await s3.putObject({ Bucket: "img-resizer-lambda", Body: resizedConvertedImg, Key:`${convertedResized}/${resizedConvertedName}`}).promise()
            }
        }
        const newData = await s3.listObjects({ Bucket: "img-resizer-lambda" }).promise();
        return newData;
    }
    catch(err) {
    }
}

