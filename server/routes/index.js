var express = require('express');
var router = express.Router();

router.route('/').get(function(req, resp) {
  resp.status(200).json('Resume site comming soon');
});

router.route('/movie/:id').get((req,resp) => {
  let douban_id = req.params.id;
  resp.json('movie detail '+douban_id);
});

var os = require('os');
router.route('/sysdata').post((req,resp)=>{
  var cpus = os.cpus();
  for(var i = 0, len = cpus.length; i < len; i++) {
    console.log("CPU %s:", i);
    var cpu = cpus[i], total = 0;

    for(var type in cpu.times) {
      total += cpu.times[type];
    }

    for(type in cpu.times) {
      console.log("\t", type, Math.round(100 * cpu.times[type] / total));
    }
  }
  var totalmem = os.totalmem();
  var freemem = os.freemem();
  resp.json({totalmem,freemem,cpus});
});

module.exports = router;