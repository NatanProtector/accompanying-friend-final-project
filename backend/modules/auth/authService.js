const bcrypt = require('bcrypt');
const User = require('../Users/userModel');

async function login(email, password, role) {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: 'User not found' };

  if (user.registrationStatus !== 'approved') {
    throw { status: 403, message: 'User registration not approved' };
  }

  if (!user.multiRole.includes(role)) {
    throw { status: 403, message: `User does not have the role: ${role}` };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  user.lastLogin = new Date();
  await user.save();

  return {
    user: {
      userId: user._id,
      email: user.email,
      role,
      fullName: user.fullName,
    },
  };
}

module.exports = { login };
