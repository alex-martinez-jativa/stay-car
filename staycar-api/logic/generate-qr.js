const { validate } = require("staycar-utils");
const { models: { Ticket } } = require("staycar-data");
const { NotAllowedError } = require("../../staycar-errors");
const qr = require('qr-image');
const fs = require('fs')

module.exports = (carPlate) => {
    console.log(carPlate)
    
    validate.string(carPlate, "carPlate")
    // Generate QR Code from text
    return Ticket.findOne({carPlate})
        .then((carPlate) => {
            
            if(carPlate) throw new NotAllowedError(`${carPlate} is already inside`)
        })
        .then(() => {

            var qr_png = qr.imageSync(carPlate,{ type: 'png'})
            //var qr_png = qr.image(carPlate,{ type: 'png'})
            // Generate a random file name 
            let qr_code_file_name = new Date().getTime() + '.png';
        
            fs.writeFileSync('./public/qr/' + qr_code_file_name, qr_png, (err) => {
            //fs.writeFile('./public/qr/' + qr_code_file_name, qr_png, (err) => {    
                if(err){
                    throw new Error(err)
                }
            })
        })    
}

