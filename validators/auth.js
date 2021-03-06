const {check} = require('express-validator');

exports.userSignupValidator = [
  check('name').not().isEmpty().withMessage('Error: Name is required'),
  check('email').isEmail().withMessage('Error: Must be a valid email address'),
  check('password').isLength({min: 6}).withMessage('Error: Password must be at least 6 characters long')
];

exports.userSigninValidator = [
  check('email').isEmail().withMessage('Error: Must be a valid email address'),
  check('password').isLength({min: 6}).withMessage('Error: Password must be at least 6 characters long')
];
