# ImageBank server

It's a simple NodeJs server to store images on a Mongo Database

## Configuration

The configuration of the server is done using environment variables to be easilly used with OpenShift

- **MONGODB_PORT** : The MongoDB server port (default *27017*)
- **MONGODB_ADDRESS** : The MongoDB server address (default *database*)
- **MONGODB_USER** : The user to authenticate on MongoDB (default *none*)
- **MONGODB_PASSWD** : The password to authenticate on MongoDB (default *none*)
- **MONGODB_DATABASE** : The database to connect to on MongoDB (default *imagesbank*)
- **ADMIN_KEY** : The AdminKey to execute *Admin* requests
- **LISTEN_PORT** : The port to listen to (default *8080*)
- **LISTEN_IP** : The ip address to listen to (default *0.0.0.0*)

If you use a User/Password to connect on MongoDB, make sure the user has the role **readWriteAnyDatabase** : https://docs.mongodb.com/manual/reference/built-in-roles/#all-database-roles

## API

The API description is provide with a swagger file available in /api/swagger/swagger.yaml

When you run the server, it start a swagger-ui available at http://<server ip>:8080/api/docs

## Version

- 1.0.0 Manage storing and retreiving images
- 1.1.0 (in progress) Integration of (sharp)[https://github.com/lovell/sharp] to allow creation of thumbnails