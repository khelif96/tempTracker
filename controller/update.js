const Temp = require('../models/tempSchema');


const maxCount = 60;

exports.request = (req, res) => {
  const {temp, humidity} = req.body;

Temp.findOne({},{},{ sort: { 'createdAt' : -1 } }, (err,statsBucket) => {
  if(err) res.status(500).send(err);
  // console.log("Bucket")
  // console.log(statsBucket);
  if(!statsBucket || statsBucket == null){
    // console.log("New bucket")
    let tempData = {
      tempBucket: [{
        time: Date.now(),
        temp
      }],
      humidityBucket: [{
        time: Date.now(),
        humidity
      }],
      count: 1
  };
    let tempEntry = new Temp(tempData);
    // console.log(tempEntry)
    tempEntry.save((error) => {
      if(!error){ res.status(201).send("Created New Bucket");}else{
        res.status(400).json({error: error, message: "ERROR"});

      }
    })
  }else{


  // res.json({message: "Just works", statsBucket})
  if(statsBucket){
    // console.log("Found bucket")
    if(statsBucket.count == maxCount){
      let tempData = {
      tempBucket: [{
        time: Date.now(),
        temp
      }],
      humidityBucket: [{
        time: Date.now(),
        humidity
      }]
    };
      let tempEntry = new Temp(tempData);
      tempEntry.save((error) => {
        if(!error){ res.status(201).send("Created New Bucket second");}else{
          res.status(400).send("Server Error while Saving");

        }
      })
    }else{
      statsBucket.tempBucket.push({
        time: Date.now(),
        temp: temp
      })
      statsBucket.humidityBucket.push({
        time: Date.now(),
        humidity: humidity
      });
      statsBucket.count += 1;
      const query = {_id: statsBucket._id}
      Temp.updateOne(query, statsBucket, (error) => {
        if(!error){ res.status(201).send("Updated bucket");}else{
          res.status(400).send("Server Error while Saving");

        }
      });
      // res.json(statsBucket);
    }
  };
}

});
// let tempEntry = new Temp(tempData);
// tempEntry.save((error) => {
//   if(!error){
//     return res.status(201).send("OK");
//   } else {
//     if (error.code ===  11000) { // this error gets thrown only if similar statsBucket record already exist.
//       return res.status(409).send('statsBucket already exist!');
//       } else {
//         return res.status(500).send('error signing up statsBucket');
//       }
// }
// });
};
