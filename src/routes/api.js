(function () {

  var express = require('express');
  var mongoose = require('mongoose');

  var router = express.Router();
  var Panel = mongoose.model('Panel');

  function verifyAuthentication(req, res, next) {
    if (!req.isAuthenticated())
      return res.status(401).send('Authentication required.');
    return next();
  }

  router.use(verifyAuthentication);

  router.route('/panels')

    .get(function (req, res, next) {
      Panel.find(function (err, panels) {
        if (err) {
          return res.status(500).send(err);
        }
        return res.send(panels);
      });
    })

    .post(function (req, res, next) {
      var panel = new Panel();
      panel.name = req.body.name;
      panel.created_at = Date.now();

      panel.save(function (err, panel) {
        if (err)
          return res.status(500).send(err);
        return res.json({ id: panel._id.toString() });
      });
    });

  router.route('/panels/:id')
    .get(function (req, res) {
      Panel.findById(req.params.id, function (err, panel) {
        if (err)
          return res.status(500).send(err);
        return res.send(panel);
      });
    });

  router.route('/panels/:panelId/tasks')

    .post(function (req, res) {

      Panel.findById(req.params.panelId, function (err, panel) {
        if (err)
          return res.status(500).send(err);

        var newTask = panel.tasks.create({
          title: req.body.title,
          details: req.body.details,
          created_by: req.user.id,
          created_at: Date.now()
        });

        if (!panel.tasks)
          panel.tasks = [];

        panel.tasks.push(newTask);

        panel.save(function (err, savedPanel) {
          if (err)
            return res.status(500).send(err);

          return res.json({ 
            id: newTask._id.toString(),
            created_by: req.user.username,
            created_at: newTask.created_at
          });
        });
      });
    });

  router.route('/panels/:panelId/tasks/:id')

    .get(function (req, res) {
      return res.send('route working! ColumnId: ' + req.params.columnId);
    })

    .put(function (req, res) {
    
      Panel.findOneAndUpdate(
        { '_id': req.params.panelId, 'tasks._id': req.params.id },
        {
          '$set': {
            'tasks.$.title': req.body.title,
            'tasks.$.details': req.body.details,
            'tasks.$.modified_by': req.user.id,
            'tasks.$.modified_at': Date.now()
          }
        },
        { 
          new: true,
          projection: { 
            'tasks': { 
              '$elemMatch': { '_id': req.params.id } 
            }
          }
        },
        function (err, panel) {
          if (err)
            return res.status(500).send(err);
          
          return res.json({ 
            id: panel.tasks[0]._id, 
            modified_at: panel.tasks[0].modified_at, 
            modified_by: req.body.username
          });
        })
        
    });

  module.exports = router;

})();