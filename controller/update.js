const Temp = require('../models/tempSchema');

exports.request = (req, res) => {
  const {temp, humidity} = req.body;
  let tempData = {
  temp,
  humidity
};

let tempEntry = new Temp(tempData);
tempEntry.save((error) => {
  if(!error){
    return res.status(201).send("OK");
  } else {
    if (error.code ===  11000) { // this error gets thrown only if similar user record already exist.
      return res.status(409).send('user already exist!');
      } else {
        return res.status(500).send('error signing up user');
      }
}
});
};
