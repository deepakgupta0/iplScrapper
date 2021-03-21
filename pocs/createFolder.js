var fs = require('fs');
var dir = __dirname+'/ipl2020';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fs.open(path.join(dir,'mynewfile2.txt'), 'w', function (err, file) {
    // if (err) throw err;
    // console.log('Saved!');
  });