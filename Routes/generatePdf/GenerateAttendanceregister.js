var express = require("express");
var GenerateAttendanceregister = express();
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
var mysql = require("mysql");
var config = require("../../DB");
var con = mysql.createPool(config);
GenerateAttendanceregister.get("/", function(req, res) {
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call GetApplicationsHeard()";
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
      });
    }
  });
});
GenerateAttendanceregister.get("/:ID/:Value", function(req, res) {
  const ID = req.params.ID;
  const Value = req.params.Value;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      if (Value === "Sittings") {
        let sp = "call GetSittingsPerApplicationNo(?)";
        connection.query(sp, [ID], function(error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            res.json(results[0]);
          }
          connection.release();
        });
      }
      if (Value === "Attendance") {
        let sp = "call GetAttendanceRegister(?)";
        connection.query(sp, [ID], function(error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            res.json(results[0]);
          }
          connection.release();
        });
      }
    }
  });
});
GenerateAttendanceregister.post("/", function(req, res) {
  //console.log(req.body);
  try {
    (async () => {
      try {
        var dataBinding = req.body;
        var templateHtml = fs.readFileSync(
          path.join(
            process.cwd(),
            "Routes",
            "Reporttemplates",
            "Attendance.hbs"
          ),
          "utf8"
        );

        // var template = handlebars.compile(templateHtml)(dataBinding);
        var finalHtml = handlebars.compile(templateHtml)(dataBinding);
        var storagepath = path.join(
          process.cwd(),
          "Reports",
          "Attendance",
          req.body.Applicationno + ".pdf"
        );
        var options = {
          format: "A4",
          landscape: true,
          headerTemplate: "<p></p>",
          footerTemplate: `<div style="width:100%; text-align: center;font-weight: 700!important;font-size:10px;"><hr/>Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
          displayHeaderFooter: true,
          margin: {
            top: "20px",
            bottom: "100px"
          },
          printBackground: true,
          path: storagepath
        };
        const browser = await puppeteer.launch();
        // const browser = await puppeteer.launch({
        //   executablePath: "/usr/local/bin/chrome"
        // });
        const page = await browser.newPage();
        await page.setContent(finalHtml);
        //  await page.emulate("screen");
        await page.pdf(options);
        await browser.close();
        res.json({
          success: true,
          message: "Generated"
        });
      } catch (err) {
        res.json({
          success: true,
          message: err
        });
      }
    })();
  } catch (err) {
    res.json({
      success: false,
      message: err
    });
  }
});

module.exports = GenerateAttendanceregister;
