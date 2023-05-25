const { response } = require("express");
const adminHelper = require("../../helpers/adminHelper");

module.exports = {
  report: (req, res) => {
    res.render("admin/salesReport");
  },
  customreport: (req, res) => {
    adminHelper.customreport(req.body.start, req.body.end).then((data) => {
      console.log("DONE");

      res.render("admin/salesReportTable", { data });
    });
  },

  monthlyreport: (req, res) => {
    let start = new Date(req.body.start);
    let end = new Date(req.body.end);
    end.setDate(1); // set the day to the first of the month
    end.setMonth(end.getMonth() + 1); // increment the month by 1
    end.setDate(0);

    adminHelper.monthlyreport(start, end).then((data) => {
      res.render("admin/salesReportTable", { data });
    });
  },

  annualreport: (req, res) => {
    let start = req.body.start;
    let end = req.body.end;

    adminHelper.annualreport(start, end).then((data) => {
      res.render("admin/salesReportTable", { data });
    });
  },
};
