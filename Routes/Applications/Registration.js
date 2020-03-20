var express = require("express");
var Registration = express();
var mysql = require("mysql");
var config = require("../../DB");
var con = mysql.createPool(config);
var Joi = require("joi");
var auth = require("../../auth");
Registration.get("/", auth.validateRole("Registration"), function(req, res) {
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call getregistrations()";
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
Registration.get("/:ID", auth.validateRole("Registration"), function(
  req,
  res
) {
  const ID = req.params.ID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call GetOneRegistration(?)";
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
Registration.post("/", auth.validateRole("Registration"), function(req, res) {
  const schema = Joi.object().keys({
    IDNumber:Joi.string().min(5).required(),
      Fullname: Joi.string().min(5).required(),
      Gender: Joi.string().min(1).required(),
      Phone: Joi.string().min(3).required(),
      Email: Joi.string().min(3).required(),
      DOB:Joi.date().required(), 
      Country: Joi.string().min(3).required(),
      Passport: Joi.string(),
      Religion: Joi.string().min(3).required(),
      Marital: Joi.string().min(3).required(),
      Height: Joi.string().min(3).required(),
      Weight: Joi.string(),
      Languages: Joi.string(),
      Skills: Joi.string()
  });
  const result = Joi.validate(req.body, schema);
  if (!result.error) {
    let data = [
      req.body.IDNumber,
      req.body.Fullname,
      req.body.Gender,
      req.body.Phone,
      req.body.DOB,
      req.body.Email,
      req.body.Country,
      req.body.Passport,
      req.body.Religion,
      req.body.Marital,
      req.body.Height,
      req.body.Weight,
      req.body.Languages,
      req.body.Skills,
      res.locals.user
    ];
    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        let sp = "call SaveRegistration(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
Registration.put("/:ID", auth.validateRole("Registration"), function(
  req,
  res
) {
  const schema = Joi.object().keys({
    Fullname: Joi.string().min(5).required(),
    Gender: Joi.string().min(1).required(),
    Phone: Joi.string().min(3).required(),
    DOB:Joi.date().required(), 
    Email: Joi.string().min(3).required(),
    Country: Joi.string().min(3).required(),
    Passport: Joi.string(),
    Religion: Joi.string().min(3).required(),
    Marital: Joi.string().min(3).required(),
    Height: Joi.string().min(3).required(),
    Weight: Joi.string(),
    Languages: Joi.string(),
    Skills: Joi.string()
  });
  const result = Joi.validate(req.body, schema);
  if (!result.error) {
    const ID = req.params.ID;
    let data = [
      req.body.Fullname,
      req.body.Gender,
      req.body.Phone,
      req.body.Email,
      req.body.DOB,
      req.body.Country,
      req.body.Passport,
      req.body.Religion,
      req.body.Marital,
      req.body.Height,
      req.body.Weight,
      req.body.Languages,
      req.body.Skills,
      ID, 
      res.locals.user];
    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        let sp = "call UpdateRegistration(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(sp, data, function(error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            res.json({
              success: true,
              message: "Updated"
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
Registration.delete("/:ID", auth.validateRole("Registration"), function(
  req,
  res
) {
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
      let sp = "call DeleteRegistration(?,?)";
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
module.exports = Registration;
