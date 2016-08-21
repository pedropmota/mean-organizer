var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
var Panel = mongoose.model('Panel');

router.route('/panels')
  
  .get(function(req, res, next) {
    Panel.find(function(err, panels){
      if(err){
        return res.send(500, err);
      }
      return res.send(panels);
    });
  })

  .post(function(req, res, next) {
    var panel = new Panel();
    panel.name = req.body.name;
    panel.created_at = Date.now();
    
    panel.save(function(err, panel) {
      if (err)
        return res.send(500, err);
      return res.json(panel);
    })
  });

router.route('/panels/:id')
  .get(function(req, res) {
    Panel.findById(req.params.id, function(err, panel) {
      if (err) 
        return res.send(500, err);
      return res.send(panel);
    });  
  });

router.route('/tasks')

/* GET all tasks */
.get(function(req, res, next) {
  res.send('respond with a resource');
})

/* POST new task */
.post(function(req, res, next) {
  var task = req.body;
  task.id = Date.now();
  
  setTimeout(function() {
    res.send(task);
  }, 300);
})

router.route('/tasks/:id')

.get(function(req, res, next) {
  return res.send({ message: 'TODO get specific task from the db with id ' + req.params.id});
})

.put(function(req, res, next) {
  var task = req.body;
  task.title += " from server!";
  setTimeout(function() {
    res.send(task);
  }, 300);

});


module.exports = router;