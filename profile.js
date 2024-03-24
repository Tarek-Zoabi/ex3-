/**
 * 
 * Tarek Zoabi 208262501
	Mohammad Azaizi 323951988
	Bashar Helo  324047323
 * @param express imports the express module for it to be used in the server
 * @param app the app is an express server which will have endpoints that get the HTML pages
 * @param ejs embedded js dependency for node and page rendering
 */
const express = require('express');
const ejs = require('ejs')
const path= require('path')
const fs= require('fs')
let app = express();
app.set('view engine',ejs)
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))

/**
 * @param req an HTTP request with a query of the animal ID
 * @returns res HTTP response which renders the ejs profile according to the ID
 */
app.get('/profile',(req,res)=>{
    let id= req.query.id.toLowerCase();
    const profilePic=`./${id}/profile.png`
    const bannerPic =`./${id}/banner.png`
    const titleAndParags = getTitle(id)
    const bioArray=getBioTextArranged(id)
    const image1=getImageByIdAndNumber(id,1)
    const image2 = getImageByIdAndNumber(id,2) 
    const textFilesJaggedArr=getEndTextFileContentArray(id)
    const teamImages=getDebuggersProfImgs(id)
    res.render('profile.ejs', 
    { 
      id, 
      profilePic, 
      bannerPic,
      titleAndParags,
      bioArray,
      image1,
      image2,
      textFilesJaggedArr ,
      teamImages
    });
})
/**
 * 
 * @param  id the id of the animal in the /profile query 
 * @returns content which is an array of the title and the paragraphs below it
 */
function getTitle(id){
    const titlePath= `./private/${id}/title.txt`
    const titleText= fs.readFileSync(titlePath,"utf-8")
    /**
     * *Getting the line containing the title to be split from the second line 
     * *that contains 2 sentences
     */
    const lines= titleText.split('\n')
    /**
     * *The content of each title file would be indexed in this list
     * *the actual profile title e.g. "Mickey the debug dog" would occupy the 0th index
     * *while the text within the paragraphs occupies the rest of the array
     */
    const content=[]
    //title being pushed inside the array
    content.push(lines[0])
    let sentences=''
    if(id=='mickey'){
        //regex that splits the first sentence in line 2 from the second without changing any content
        const regex = /\. (?=<(?:a href[^>]+>))/;

        // Split the text using the regular expression
        sentences = lines[1].split(regex)
    }
    else{
        sentences=lines[1].split('.')
    }
    
    content.push(sentences[0])
    content.push(sentences[1])

    return content

}
/**
 * 
 * @param  {*Animal Name} id
 * @returns {*lines} an array of formatted bio parts
 */
function getBioTextArranged(id){
    const path= `./private/${id}/bio.txt`
    const unArrangedText = fs.readFileSync(path,'utf-8')
    const lines = unArrangedText.split("\n")
    for (let i = 0; i < lines.length; i++) {
        const splitIndex = lines[i].indexOf(':');
        if (splitIndex !== -1) { // Ensure the colon exists in the line
            const firstPart = lines[i].substring(0, splitIndex).trim();
            const secondPart = lines[i].substring(splitIndex + 1).trim();
            lines[i] = `<div class='info-content'><p>${firstPart}</p><p class='bio-content'>${secondPart}</p></div>`;
        } 
    }
    return lines
}

function getImageByIdAndNumber(id,imageNum){
    if(imageNum>2)
    {
        return undefined;
    }
    return `./${id}/image${imageNum}.png`
}
function getEndTextFileContentArray(id){
    
   
    const fileArray = [];
    const files = fs.readdirSync(`./private/${id}`);

    files.filter(file => {
        if (file.includes('text')) {
            fileArray.push(file);
        }
    });

    
    for(let i=0; i<files.length;i++){
        fileArray[i] = getEndorsement(id,files[i])
    }
    return fileArray
}
function getEndorsement(id,textName){
    let TextArray=[]
    if(typeof textName!== "string"){
        return undefined
    }
    else{
       
       
            let path= `./private/${id}/${textName}`
            const textFile = fs.readFileSync(path,'utf-8')
            TextArray = textFile.split("\n")
            return TextArray
        
    }
}
function getDebuggersProfImgs(id){
    const Images=[]
    const contents = fs.readdirSync("./public");

    // Filter out directories
    const subdirectories = contents.filter(item => {
        // Check if the item is a directory
        return fs.statSync(`./public/${item}`).isDirectory();
    });

    for(let i =0; i<subdirectories.length;i++){
        if(subdirectories[i].toLowerCase()!=id.toLowerCase()){
            Images.push(
                `<a href="http://localhost:3000/profile?id=${subdirectories[i]}">
                    <img class="friend" src="./${subdirectories[i]}/profile.png" alt="Profile Image">
                </a>`
                )
        }
    }
    return Images
    
}

let port = 3000
app.listen(port,()=>{
    console.log(`listening on port: ${port}`)
})