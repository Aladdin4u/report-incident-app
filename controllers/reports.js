const cloudinary = require("../middleware/cloudinary");
const Report = require("../models/Report");

module.exports = {
  getDashboard: async function (req, res, next) {
    try {
      const username = req.user.userName;
      const reports = await Report.find({ user: req.user.id })
        .sort({ createdAt: "desc" })
        .lean();
      res.render("dashboard.ejs", {
        reports,
        title: "dashboard",
        username,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllReport: async function (req, res, next) {
    try {
      const username = req.user;
      const reports = await Report.find()
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();

      res.render("reports/index", { reports, title: "Home", username });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getReportDetails: async function (req, res, next) {
    try {
      const username = req.user.userName;
      const report = await Report.findById({ _id: req.params.id })
        .populate("user")
        .lean();

      if (!report) {
        return res.render("/error/404");
      }
      res.render("reports/details", {
        report,
        title: "Report Details",
        username,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getCreate: async function (req, res, next) {
    try {
      const username = req.user.userName;
      res.render("reports/create", { title: "Create a new Report", username });
    } catch (err) {
      next(err);
    }
  },
  create: async function (req, res, next) {
    try {
      req.body.user = req.user.id;
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Report.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        withness: req.body.withness,
        tbody: req.body.tbody,
        user: req.user.id,
      });
      res.redirect("/dashboard");
    } catch (err) {
      next(err);
    }
  },
  delete: async function (req, res, next) {
    try {
      // Find post by id
      let report = await Report.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(report.cloudinaryId);
      // Delete report from database
      await Report.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.redirect("/error/404");
    }
  },
  edit: async function (req, res, next) {
    try {
      const username = req.user.userName;
      const report = await Report.findOne({ _id: req.params.id }).lean();
      if (!report) {
        return next();
      }

      if (report.user != req.user.id) {
        res.redirect("/report");
      } else {
        res.render("reports/edit", { report, title: "Edit Report", username });
      }
    } catch (err) {
      next(err);
    }
  },
  update: async function (req, res, next) {
    try {
      let result;
      let report = await Report.findById({ _id: req.params.id }).lean();

      if (!report) {
        return res.redirect("/error/404");
      }

      if (report.user != req.user.id) {
        res.redirect("/reports");
      } else {
        if (req.file) {
          // Delete image from cloudinary
          await cloudinary.uploader.destroy(report.cloudinaryId);
          // Upload image to cloudinary
          result = await cloudinary.uploader.upload(req.file.path);
        }

        const updates = {
          title: req.body.title || report.title,
          withness: req.body.withness || report.withness,
          image: report.image || result.secure_url,
          cloudinaryId: report.cloudinaryId || result.public_id,
          tbody: req.body.tbody || report.tbody,
          user: req.user.id,
        };

        report = await Report.findByIdAndUpdate(
          { _id: req.params.id },
          updates,
          {
            new: true,
            runValidators: true,
          }
        );
        res.redirect("/dashboard");
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
};
