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
      Panel
        .find({ created_by: req.user.id })
        .populate('created_by')
        .populate('tasks.created_by')
        .populate('tasks.modified_by')
        .exec(function (err, panels) {
        if (err)
          return res.status(500).send(err);

        return res.send(toView(panels));
      });
    })

    .post(function (req, res, next) {
      if (!req.body.name)
        return res.status(400).send('name is required.');

      var panel = new Panel();
      panel.name = req.body.name;
      panel.created_by = req.user.id;
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
    })
    
    .put(function (req, res) {
      if (!req.body.name)
        return res.status(400).send('name is required.');

      Panel.findOneAndUpdate(
        { '_id': req.params.id },
        {
          '$set': {
            'name': req.body.name
          }
        },
        function (err, panel) {
          if (err)
            return res.status(500).send(err);
          
          return res.json({ id: panel._id.toString() });
        }
      );
    });

  router.route('/panels/:panelId/tasks')

    .post(function (req, res) {
      if (!req.body.title)
        return res.status(400).send('title is required.');

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
          new: true, //Returns the updated document
          projection: { //Projects tasks, setting it only as the one updated, instead of the entire array
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

  function toView(dbPanels) {
    var panelsResponse = [];

    dbPanels.forEach(function (panel) {
      var newPanel = {
        id: panel._id.toString(),
        name: panel.name,
        created_by: panel.created_by.username,
        created_at: panel.created_at,
        tasks: []
      };

      panel.tasks.forEach(function (task) {
        newPanel.tasks.push({
          id: task._id.toString(),
          title: task.title,
          details: task.details,
          created_at: task.created_at,
          modified_at: task.modified_at,
          created_by: task.created_by.username,
          modified_by: task.modified_by ? task.modified_by.username : null,
        });
      });

      panelsResponse.push(newPanel);
    });

    return panelsResponse;
  }

})();