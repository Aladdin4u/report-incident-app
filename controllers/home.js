const Report = require("../models/Report");
module.exports = {
  getIndex: async (req, res) => {
    try {
      const users = req.user;
      const reports = await Report.find()
        .populate("user")
        .sort({ createdAt: "desc" })
        .lean();

      res.render("index.ejs", { reports, title: "Home", users });
    } catch (err) {
      console.error(err);
      res.render("error/404");
    }
  },
  getAbout: (req, res) => {
    const users = req.user;
    res.render("about.ejs", { title: "About", users });
  },
};
