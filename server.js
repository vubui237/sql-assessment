const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , config = require('./config')
    , ctrl = require('./controller.js');

const mainCtrl = require('./mainCtrl');

const app = express();

app.use(bodyParser.json())
app.use(cors());

// You need to complete the information below to connect
// to the assessbox database on your postgres server.
massive(config.connectionString).then( db => {
  app.set('db', db);

  // Initialize user table and vehicle table.
  db.init_tables.user_create_seed().then( response => {
    console.log('User table init');
    db.init_tables.vehicle_create_seed().then( response => {
      console.log('Vehicle table init');
    })
  })

})


// ===== Build enpoints below ============
app.get('/api/users', ctrl.getAllUsers);
app.get('/api/vehicles', ctrl.getAllVehicles);
app.get('/api/user/:id/vehiclecount', ctrl.getCountCarsByID);
app.get('/api/user/:id/vehicle', ctrl.getCarsByUserID);
app.get('/api/newervehiclesbyyear', ctrl.getVehiclesByYear);
app.get('/api/vehicle', ctrl.getQuery);

app.put('/api/vehicle/:vid/user/:uid', ctrl.UpdateVehicleOwner)


app.post('/api/users', ctrl.addUser);
app.post('/api/vehicles', ctrl.addVehicle);

app.delete('/api/user/:uid/vehicle/:vid', ctrl.DeleteOwnership);
app.delete('/api/vehicle/:id', ctrl.DeleteVehicleByID);





// ===== Do not change port ===============
const port = 3000;
app.listen(port, () => {
  console.log('Listening on port: ', port);
})
