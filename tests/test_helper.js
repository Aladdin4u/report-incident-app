const Report = require("../models/report");

const initialreports = [
    {
        title: "accident",
        withness: "bystander",
        tbody: "accident could you define the complexity of the grey area.",
        img: ["img1.jpg"]
    },
    {
        title: "fighting",
        withness: "Victim",
        tbody: "fighting could you define the complexity of the grey area.",
        img: ["img1.jpg"]
    },
  ];

  const nonExistingId = async () => {
    const report = new Report({title: "willremobve Soon"})
    await report.save();
    await report.remove();

    return report._id.toString()
  }

  const reportInDB = async () => {
    const reports = await Report.find({});
    return reports.map(report => report.toJSON())
  }

module.exports = {
    initialreports,
    nonExistingId,
    reportInDB
}