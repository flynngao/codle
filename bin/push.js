var nodemailer = require("nodemailer");
var config = require('./.user-config.json');

// create reusable transport method (opens pool of SMTP connections)




exports.push = function(path,attachments,cb){

    if(config && config.email && config.pass && config.kindle){
        var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: config.email,
            pass: config.pass
            }
        });

        var mailOptions = {
            from: "codle <"+config.email+">", // sender address
            
        };

        console.log(path,attachments);
        // push 地址
        mailOptions.to = config.kindle
        mailOptions.subject = 'Codle '+ attachments;
        mailOptions.attachments = {
            fileName: attachments,
            filePath: path
        }
        console.log('Start!')
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
        
            cb('');
        });
    }else{
        cb('config is error');
    }
    
    

}
