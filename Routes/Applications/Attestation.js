var express = require("express");
var Attestation = express();
var mysql = require("mysql");
var config = require("../../DB");
var con = mysql.createPool(config);
var Joi = require("joi");
var auth = require("../../auth");
Attestation.get("/", auth.validateRole("Attestation"), function(req, res) {
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call Getattestation()";
      connection.query(sp, function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
Attestation.get("/:ID", auth.validateRole("Attestation"), function(req, res) {
  const ID = req.params.ID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call GetOneattestation(?)";
      connection.query(sp, ID, function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
Attestation.post("/", auth.validateRole("Attestation"), function(req, res) {
  const schema = Joi.object().keys({
    Number:Joi.number().integer().min(1),
    DOS:Joi.date().required(),
    Clearance_status: Joi.string().required(),
    Clearance_Date:Joi.date().required(),
    Cost: Joi.string().required(),
  });
  const result = Joi.validate(req.body, schema);
  if (!result.error) {
    let data = [
      req.body.Number,
      req.body.DOS,
      req.body.Clearance_status,
      req.body.Clearance_Date,
      req.body.Cost,
      res.locals.user,
  
    ];
    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        let sp = "call SaveAttestation(?,?,?,?,?,?)";
        connection.query(sp, data, function(error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            res.json({
              success: true,
              message: "saved"
            });
          }
          connection.release();
          // Don't use the connection here, it has been returned to the pool.
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: result.error.details[0].message
    });
  }
});
Attestation.put("/:ID", auth.validateRole("Attestation"), function (req, res) {
    const schema = Joi.object().keys({
        Number:Joi.number().integer().min(1),
        DOS:Joi.date().required(),
        Clearance_status: Joi.string().required(),
        Clearance_Date:Joi.date().required(),
        Cost: Joi.string().required(),
    });
    const result = Joi.validate(req.body, schema);
    if (!result.error) {
      const ID = req.params.ID;
      let data = [
      req.body.Number,
      req.body.DOS,
      req.body.Clearance_status,
      req.body.Clearance_Date,
      req.body.Cost,
      res.locals.user,
        ID 
      ];
      con.getConnection(function (err, connection) {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        } // not connected!
        else {
          let sp = "call UpdateAttestation(?,?,?,?,?,?,?)";
          connection.query(sp, data, function (error, results, fields) {
            if (error) {
              res.json({
                success: false,
                message: error.message
              });
            } else {
              res.json({
                success: true,
                message: "updated successfully"
              });
            }
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
          });
        }
      });
    } else {
      res.json({
        success: false,
        message: result.error.details[0].message
      });
    }
  });
Attestation.delete("/:ID", auth.validateRole("Attestation"), function(req, res) {
  const ID = req.params.ID;
  let data = [ID, res.locals.user];

  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call DeleteAttestation(?,?)";
      connection.query(sp, data, function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json({
            success: true,
            message: "Deleted Successfully"
          });
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
module.exports = Attestation;
