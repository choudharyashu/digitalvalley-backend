const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const { register, login, updateUserRole } = require('./controllers/authController');
const User = require('./models/User');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');


// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', register);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', login);

// @route    GET api/auth/user
// @desc     Get user data
// @access   Private
// Get all users
router.get('/users', auth, async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude the password field
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// Add the route to update user role
router.put('/users/:id/role', auth, updateUserRole);

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const resetToken = uuidv4();
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes expiry
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const smsText = `Dear User You are hereby informed that Please follow the link to reset your password for Digital Valley.The link will be valid for 30 minutes only.\n ${resetLink} \n Regards techvein`;
    
    // Send SMS using the API
    await axios.get(`https://api.infobip.com/sms/1/text/query?text=${encodeURIComponent(smsText)}&username=Techvein&password=Amitdad@226&from=TCVEIN&to=${user.mobile}`);

    console.log("Sending SMS with the following details:");
    console.log(`URL: https://api.infobip.com/sms/1/text/query?text=${encodeURIComponent(smsText)}&username=Techvein&password=Amitdad@226&from=TCVEIN&to=${user.mobile}`);
    res.json({ msg: 'Password reset link has been sent to your mobile number.' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});


router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: 'Invalid request. Token and new password are required.' });
  }

  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.json({ msg: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
