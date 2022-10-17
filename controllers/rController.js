const cloudinary = require("../middleware/cloudinary");
const Report = require('../models/Report')

const getdashboard = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).lean()
    res.render('dashboard.ejs', { reports, title: 'dashboard'  })
  } catch (err) {
      console.log(err)
      res.render('error/404')
  }
}

const report_index = async (req, res) => {
  try {
    const reports = await Report.find()
    .populate('user')
    .sort({ createdAt: 'desc'})
    .lean()

    res.render('report/index', { reports, title: 'Home' })
  } catch (err) {
      console.error(err)
      res.render('error/404')
  }
}

const report_details = async (req, res) => {
  try {
    const report = await Report.findById({ _id: req.params.id })
    .populate('user')
    .lean()

    if (!report) {
        return res.render('error/404')
    }
    res.render('Reports/details', { report, title: 'Report Details'})
  } catch (err) {
      console.error(err)
      res.render('error/404', { title: 'Report not found' })
  }
}

const report_create_get = (req, res) => {
    res.render('Reports/create', {title : 'Create a new Report'})
}

const report_create_post = async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    await Report.create({
      title: req.body.title,
      image: result.secure_url,
      cloudinaryId: result.public_id,
      withness: req.body.withness,
      tbody: req.body.tbody,
      user: req.user.id,
    })
    res.redirect('/dashboard')
  } catch (err) {
    console.log(err)
  }
}

const report_delete = async (req, res) => {
  try {
    await Report.remove({ _id: req.params.id})
    res.redirect('/dashboard')
  } catch (err) {
      console.error(err)
      res.redirect('error/404')
  }
}

const report_edit = async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id}).lean()

  if (!report) {
      return res.render('error/404')
  }

  if(report.user != req.user.id) {
      res.redirect('/report')
  } else {
      res.render('report/edit', { report, title : 'Edit Report'})
  }
} 

const report_up_edit = async (req, res) => {
  try {
      const report = await Report.findById({ _id: req.params.id}).lean()

      if (!report) {
          return res.render('error/404')
      }

      if(report.user != req.user.id) {
          res.redirect('/reports')
      } else {
          report = await report.findByIdAndUpdate({ _id: res.params.id }, req.body, {
              new: true,
              runValidators: true
          })

          res.redirect('/dashboard')
      }
  } catch (err) {
      console.error(err)
      res.redirect('error/404')   
  }
  
}

module.exports = {
    getdashboard,
    report_index,
    report_details,
    report_create_get,
    report_create_post,
    report_delete,
    report_edit,
    report_up_edit
}