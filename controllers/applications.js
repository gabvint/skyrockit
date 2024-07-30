const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// everything starts with /users/:userId/applications


// controllers/applications.js

router.get('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      res.render('applications/index.ejs', {
        applications: currentUser.applications,
      });
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
});
  

router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
})

router.get('/:applicationId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);

    res.render('applications/show.ejs', {
      application: application,
    })
  } catch (error) {
      console.log(error)
      res.redirect('/')
  }

})

router.post('/', async (req, res) => {
  try {
    // look up the user from req.session 
    const currentUser = await User.findById(req.session.user)

    // push req.body to applications array of the current user 
    currentUser.applications.push(req.body)

    // save 
    await currentUser.save()

    res.redirect(`/users/${currentUser._id}/applications`)

  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.delete('/:applicationId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.id(req.params.applicationId).deleteOne();
    await currentUser.save()

    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/:applicationId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);  
    const application = currentUser.applications.id(req.params.applicationId)
    res.render('applications/edit.ejs', {
      application: application,
    })

  
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:applicationId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); 
    const application = currentUser.applications.id(req.params.applicationId)

    // Use the Mongoose .set() method
    // this method updates the current application to reflect the new form
    // data on `req.body` 
    application.set(req.body)
    await currentUser.save()

    res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`)

  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})
module.exports = router 