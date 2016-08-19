var express = require('express');
var router = express.Router();

router.route('/tasks')

/* GET all tasks */
.get(function(req, res, next) {
  res.send('respond with a resource');
})

/* POST new task */
.post(function(req, res, next) {
  res.send('TODO create new task');
})

router.route('/tasks/:id')

.get(function(req, res, next) {
  return res.send({ message: 'TODO get specific task from the db with id ' + req.params.id});
})

.put(function(req, res, next) {
  return res.send({ message: 'TODO udpate task from the db with id ' + req.params.id});
});


module.exports = router;