import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});


const cloudUploader = async function (filepath) {
    try {
        if(!filepath){
            console.log("filename not found")
        }
        const uploadResult = await cloudinary.uploader
            .upload(filepath, {
                resource_type: "auto"
            })
console.log("The content is uploaded at"+uploadResult.url)
    // fs.unlinkSync(filepath)


return uploadResult
    } catch (error) {
         fs.unlinkSync(filepath)
        console.log("error occured during file uploading"+error)
    }
}

export {cloudUploader}







// cloudinary.config({
//     cloud_name: 'dxlh2omhr',
//     api_key: '619754411115187',
//     api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
// });

// // Upload an image
//  const uploadResult = await cloudinary.uploader
//    .upload(
//        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//            public_id: 'shoes',}