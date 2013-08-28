var argv = require('fl-optimist').argv;
var exec = require('child_process').exec;
var color = require('cli-color');
var fs = require('fs');
// var pdfkit = require('pdfkit');
// var walk = require('walk');
var _ = require('underscore');
var mail = require('./mail');

var walkOptions = {
    followLinks: false,
    filters: [".git/", "node_modules/"]
};
/**
 *
 * config push para
 * 
 * @param  {username}   u  [description]
 * @param  {password}   p  [description]
 * @param  {kindle}   k  [description]
 * @param  {callback} cb [description]
 * @return {[type]}      [description]
 */
var config = exports.config = function (u, p, k,cb) {

        var regex = /^[_a-zA-Z0-9\'-]+(\.[_a-zA-Z0-9\'-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(name))$/;
        var userconfig = JSON.parse(fs.readFileSync('bin/.user-config.json'));
        var re = {
                        status:'fail',
                        config:userconfig
                 }
        // push address config
        if ( !! u && regex.test(u) && !! p && !! k && regex.test(k)) {
            userconfig.email = u;
            userconfig.pass = p;
            // kindle address config
            userconfig.kindle = k;
            
            if (typeof(userconfig) == 'object') {
                fs.writeFile('bin/.user-config.json', JSON.stringify(userconfig), function(err) {
                    if (err) throw err;
                    re.status = 'success'
                    cb(re);


                })
            } else {
                cb(re);
            }
        } else {
            cb(re);
        }
}

/**
 * hell messages
 * @return {[type]} [description]
 */
var _help = function() {
        console.log(color.green('  Helps'));
        console.log();
        console.log(color.green('  First:') + ' config your email & kindle address')
        console.log('   codle config aaa@qq.com 123456 aaa@kindle.com');
        console.log(color.green('  Then:'))
        console.log('   codle ../example.mobi');
        console.log(color.red(' Enjoy!'));
}

var push = exports.push = function (files,cb) {
     _.each(files,function(file,key){
         var name = file.split('/');
             name = name[name.length - 1];
             mail.send(file,name,function(){
                 console.log(name+color.greenBright(' done'));
                 if(key == files.length-1){
                    cb();
                 }
             }); 

    });

}

exports.bin = function(argument) {

    /**
     * config emial
     * @param  {username} u [description]
     * @param  {passward} p [description]
     * @param  {kindle} k [description]
     * @return {config}   [description]
     */
    if (argv._[0] == "config") {
        config(argv._[1], argv._[2], argv._[3], function(re) {
            if (re.status == 'success') {
                console.log('Your Email:' + color.cyan(re.config.email));
                console.log('Your Kindle:' + color.cyan(re.config.kindle))
            } else {
                console.log(color.red('Lack of Params Or wrong adress'));
                _help();
            }
        });
    } else if(!!argv._[0]){
        push(argv._,function(){
            console.log('End!');
            process.exit();
        });
        
    }
    else
    {
        _help();
    }
    


    // push
    // if (argv._[0] == "push") {

    //     if(argv.g){
    //         exec('git clone ' + argv.g, function(error, stdout, stderr) {

    //         // get repo name
    //         var repo = argv._[1].split('/')
    //         repo = repo[repo.length - 1].split('.')[0];

    //         console.log('stdout: ' + color.cyanBright(stdout));
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //             return;
    //         }

    //         // walk
    //         walker = walk.walk('./' + repo, walkOptions);
    //         var pdf = new pdfkit;
    //         walker.on('file', function(root, fileStats, next) {

    //             fs.readFile(root + '/' + fileStats.name, function(err, data) {
    //                 var page = data.toString().split('\n') 
    //                 for(var line in page){
    //                     pdf.text(page[line]);
    //                 }

    //                 pdf.addPage();
    //                 next();
    //             })

    //         });

    //         walker.on("end", function() {
    //             console.log(color.greenBright("pdf done"));
    //             pdf.write(repo + '.pdf');


    //             // push.push(repo,repo,'flynn.gao.y@kindle£.com',function(){
    //             //     console.log(color.greenBright('all done'));
    //             // });    
    //         });



    //         });
    //     }
    //     else if(argv.d){

    //         walker = walk.walk(argv.d);
    //         walker.on('file', function(root, fileStats, next) {


    //                 push.push(root,fileStats.name,function(){
    //                     console.log(color.greenBright(root+'/'+fileStats.name+' done'));
    //                 }); 
    //                 next();


    //         });

    //         walker.on("end", function() {
    //                 console.log(color.greenBright('all done'));
    //                 return;
    //         });
    //     }
    //     else if(argv.f){
               
    //     }
    //     else {
    //         console.log(color.red('Error:') + 'Empty git address');
    //         return false;
    //     }


    // }

}