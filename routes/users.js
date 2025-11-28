const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Apply authentication to all routes
router.use(protect);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/',
  authorize('admin'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sort').optional().isIn(['name', 'email', 'createdAt', 'state', 'city']).withMessage('Invalid sort field'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order === 'asc' ? 1 : -1;
      
      // Build search filter
      const search = req.query.search || '';
      const stateFilter = req.query.state || '';
      const cityFilter = req.query.city || '';
      
      const filter = {};
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (stateFilter) {
        filter.state = { $regex: stateFilter, $options: 'i' };
      }
      
      if (cityFilter) {
        filter.city = { $regex: cityFilter, $options: 'i' };
      }

      const users = await User.find(filter)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(filter);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id',
  authorize('admin'),
  upload.single('profile_image'),
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name must contain only alphabets'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .optional()
      .matches(/^\d{10,15}$/)
      .withMessage('Phone must be 10-15 digits'),
    body('state')
      .optional()
      .notEmpty()
      .withMessage('State cannot be empty'),
    body('city')
      .optional()
      .notEmpty()
      .withMessage('City cannot be empty'),
    body('country')
      .optional()
      .notEmpty()
      .withMessage('Country cannot be empty'),
    body('pincode')
      .optional()
      .matches(/^\d{4,10}$/)
      .withMessage('Pincode must be 4-10 digits'),
    body('address')
      .optional()
      .isLength({ max: 150 })
      .withMessage('Address must not exceed 150 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      let user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if email or phone already exists (excluding current user)
      const { email, phone } = req.body;
      if (email || phone) {
        const existingUser = await User.findOne({
          $or: [
            email ? { email, _id: { $ne: req.params.id } } : {},
            phone ? { phone, _id: { $ne: req.params.id } } : {}
          ]
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email or phone already exists'
          });
        }
      }

      // Handle profile image
      if (req.file) {
        // Delete old image if exists
        if (user.profile_image) {
          const oldImagePath = path.join(__dirname, '..', user.profile_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        req.body.profile_image = `/uploads/${req.file.filename}`;
      }

      // Update user
      user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'User updated successfully',
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete profile image if exists
    if (user.profile_image) {
      const imagePath = path.join(__dirname, '..', user.profile_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

