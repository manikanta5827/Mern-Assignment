import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register User
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  // console.log(req.body);
  try {
    // Hash the password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      f_userName: username,
      f_Pwd: hashedPassword,
      email,
    });

    // Save user to the database
    await user.save();
    // console.log();

    // Respond with success
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(400).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body; // Use consistent field names
 

  try {
    // Check if user exists
    const user = await User.findOne({ f_userName: username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // console.log(user);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.f_Pwd);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // console.log(isMatch);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiry (1 hour)
    });
    // console.log(token);

    res.status(200).json({ token, username });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(501).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser };
