var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
var Panel = mongoose.model('Panel');

router.route('/panels')
  
  .get(function(req, res, next) {
    Panel.find(function(err, panels){
      if(err){
        return res.status(500).send(err);
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
        return res.status(500).send(err);
      return res.json({ id: panel._id.toString() });
    })
  });

router.route('/panels/:id')
  .get(function(req, res) {
    Panel.findById(req.params.id, function(err, panel) {
      if (err) 
        return res.status(500).send(err);
      return res.send(panel);
    });  
  });

router.route('/panels/:panelId/tasks')

  .post(function(req, res) {

    Panel.findById(req.params.panelId, function(err, panel) {
      if (err) 
        return res.status(500).send(err);
      
      var newTask = panel.tasks.create({
        title: req.body.title,
        details: req.body.details
      });

      if (!panel.tasks)
          panel.tasks = [];

      panel.tasks.push(newTask);

      panel.save(function(err, savedPanel) {
        if (err)
          return res.status(500).send(err);
        
        return res.json({ id: newTask._id.toString() });
      });
    });
});

router.route('/panels/:panelId/tasks/:id')
  
  .get(function(req, res) {
    return res.send('route working! ColumnId: ' + req.params.columnId);
  })

  .put(function(req, res) {

    Panel.findOneAndUpdate(
      {'_id': req.params.panelId, 'tasks._id': req.params.id},
      {
         '$set': {
           'tasks.$.title': req.body.title,
           'tasks.$.details': req.body.details,
           'tasks.$.modified_at': Date.now()
         }
      }, function(err, panel) {
        if (err)
          return res.status(500).send(err);
        
        return res.json({id: req.params.id});
      })

      //Another way of updating a subdocument. From: http://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
      // savePermission: function (folderId, permission, callback) {
      //   Folder.findOne({ _id: folderId }).populate('permissions').exec(function (err, data) {
      //       var perm = _.findWhere(data.permissions, { _id: permission._id });                

      //       _.extend(perm, permission);

      //       data.markModified("permissions");
      //       data.save(callback);
      //   });
      // }

  });

module.exports = router;