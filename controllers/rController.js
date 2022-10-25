const cloudinary = require("../middleware/cloudinary");
const Report = require("../models/Report");

const getdashboard = async (req, res) => {
  try {
    const users = req.user;
    const reports = await Report.find({ user: req.user.id })
      .sort({ createdAt: "desc" })
      .lean();
    res.render("dashboard.ejs", {
      reports,
      title: "dashboard",
      name: req.user.userName,
      users,
    });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
};

const report_index = async (req, res) => {
  try {
    const users = req.user;
    const reports = await Report.find()
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("reports/index", { reports, title: "Home", users });
  } catch (err) {
    console.error(err);
    res.render("/error/404");
  }
};

const report_details = async (req, res) => {
  try {
    const users = req.user;
    const report = await Report.findById({ _id: req.params.id })
      .populate("user")
      .lean();

    if (!report) {
      return res.render("/error/404");
    }
    res.render("Reports/details", { report, title: "Report Details", users });
  } catch (err) {
    console.error(err);
    res.render("/error/404", { title: "Report not found" });
  }
};

const report_create_get = (req, res) => {
  const users = req.user;
  res.render("Reports/create", { title: "Create a new Report", users });
};

const report_create_post = async (req, res) => {
  try {
    const users = req.user;
    req.body.user = req.user.id;
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);

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
    console.log(err);
  }
};

const report_delete = async (req, res) => {
  try {
    const users = req.user;
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
};

const report_edit = async (req, res) => {
  const users = req.user;
  const report = await Report.findOne({ _id: req.params.id }).lean();

  if (!report) {
    return res.render("/error/404");
  }

  if (report.user != req.user.id) {
    res.redirect("/report");
  } else {
    res.render("reports/edit", { report, title: "Edit Report", users });
  }
};

const report_up_edit = async (req, res) => {
  try {
    const users = req.user;
    const report = await Report.findById({ _id: req.params.id }).lean();

    if (!report) {
      return res.render("error/404");
    }

    if (report.user != req.user.id) {
      res.redirect("/reports");
    } else {
      let report = await Report.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(report.cloudinaryId);
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      const updates = {
        title: req.body.title || report.title,
        withness: req.body.withness || report.withness,
        image: result.secure_url || report.image,
        cloudinaryId: result.public_id || report.cloudinaryId,
        tbody: req.body.tbody || report.tbody,
        user: req.user.id,
      };

      report = await Report.findByIdAndUpdate({ _id: req.params.id }, updates, {
        new: true,
        runValidators: true,
      });
      // console.log(report)
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.redirect("error/404");
  }
};

module.exports = {
  getdashboard,
  report_index,
  report_details,
  report_create_get,
  report_create_post,
  report_delete,
  report_edit,
  report_up_edit,
};
