import User from '../models/User.js';

export const getUserByUsername = async (req, res) => {
  try {
    console.log("getUserByUsername route hit"); // Debug log
    console.log(`Searching for user with username: ${req.params.username}`); 

    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in getUserByUsername:", error); // Log error
    res.status(500).json({ message: 'Error fetching user by username', error });
  }
};


// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // Assuming the user ID is set in req.user by the authMiddleware
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user by ID', error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');  // No need to pass an ID here
    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};


// Toggle user activation (Activate/Deactivate)
export const toggleUserActivation = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = !user.isActive; // Toggle the activation status
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user activation', error });
  }
};
