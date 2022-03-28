
const sharp = require("sharp");
const fs = require("fs");

let newWidth = 10; 
let inputDir = 'test_files'
let outputDir = "resized_images"
let converted = "converted_images"
let convertedResized = "converted_resized_images"


async function resizeImage(image, name) {
    try {
        await sharp(image)
          .resize({
              width: newWidth
          })
          .toFile(`./${outputDir}/resized-${name}`)
    } catch (error) {
        console.log(error)
    }
}

async function convertImage(image, name) {
    try {
        let temp = name.toString()
        let newName = temp.substring(0, temp.length-3)+"webp"
        await sharp(image)
          .toFormat("webp")
          .toFile(`./${converted}/converted-${newName}`)
        await sharp(image)
            .resize({
                width: newWidth
            })
            .toFormat("webp")
            .toFile(`./${convertedResized}/converted-resized-${newName}`)
    } catch (error) {
        console.log(error)
    }
}
fs.mkdir(`./${converted}`, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Directory created successfully!")
    }
})
fs.mkdir(`./${convertedResized}`, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Directory created successfully!")
    }
})

fs.readdir(`${inputDir}`, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach(file => {
            console.log(file)
            fs.readFile(`${inputDir}/${file}`, (err, data) => {
                if(err) {
                    console.log(err)
                } else {
                    resizeImage(data, file)
                    convertImage(data, file)
                }
            })
        })
    }
})