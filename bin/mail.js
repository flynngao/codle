var nodemailer = require("nodemailer");
var config = require('./.user-config.json');

// create reusable transport method (opens pool of SMTP connections)

var serviceMap = {
    "qq.com":"qq",
    "gmail.com":"gmail"
}


exports.send = function(path,attachments,cb){

    var service = config.email.split('@');
    service = serviceMap[service[service.length-1]];
    if(config && config.email && config.pass && config.kindle){
        var smtpTransport = nodemailer.createTransport("SMTP",{
        
        service:service,
        auth: {
            user: config.email,
            pass: config.pass
            }
        });

        var mailOptions = {
            from: "codle <"+config.email+">", // sender address
            
        };

        
        // push 地址
        mailOptions.to = config.kindle
        mailOptions.subject = 'Codle '+ attachments;
        mailOptions.attachments = {
            fileName: attachments,
            filePath: path
        }
        console.log(attachments+' Start!')
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
        
            cb('');
        });
        smtpTransport.close();
    }else{
        cb('config is error');
    }
    
    

}
