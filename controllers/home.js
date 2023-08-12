const Report = require("../models/Report");
module.exports = {
  getIndex: async (req, res, next) => {
    try {
      const username = req.user;
      res.render("index.ejs", { title: "Home", username });
    } catch (err) {
      console.error(err);
      next(err)
    }
  },
  getAbout: (req, res) => {
    const username = req.user;
    res.render("about.ejs", { title: "About", username });
  },
};
