# mean-organizer
A minimalist one-page application for keeping and organizing tasks. The goal of this repository is to be a good example app for <a href="http:mean.io">MEAN stack</a> projects (AngularJS + Node.js + Express + MongoDB). 

## project structure:
- [bin](src/bin): Express startup definitions. The [www](src/bin/www)</b> file should be the node startup while debugging.
- [models](src/models): The [Mongoose](http://mongoosejs.com/) model definitions of our MongoDB documents.
- [public](src/public): Contains all the static files of our web app, such as the AngularJS scripts and Html files.
- [routes](src/routes): The Express Web API route definitions.
- [views](src/views): The place to put the Express dynamic views, but is currently not being used. (Using static html views on the [public](src/public) folder.)
- [app.js](src/app.js): Node.js configuration of the referenced packages and the setup of our Express application middleware.
- [auth-setup.js](src/auth-setup.js): The authentication setup (using [Passport](http://passportjs.org/)).

 
