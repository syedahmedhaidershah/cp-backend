/** Third party dependencies*/
const _ = require('lodash');

const bcrypt = require('bcrypt');


/** Local dependencies and functions */
const { User } = require('../../models');

const { RedisClient } = require('../../libraries');

const { signAndReturnJWT } = require('../../libraries');

const {
  AppData: { roles }
} = require('../../imports');



/** Local static objects & dependencies */
const {
  AppData: { business },
  Errors: { objects: ErrorsObjects }
} = require('../../imports');

const { SALT_ROUNDS, FORGOT_EXPIRY } = require('../../config');
const { update } = require('lodash');



const {
  getValue,
  setValue,
} = RedisClient;


/**
 * create  user
 * @property {string} req.body.emailAddress - Email of the user.
 * @property {string} req.body.firstName - FirstName of the user.
 * @property {string} req.body.lastName - LastName of the user.
 * @property {string} req.body.password - Password set by user.
 * @property {string} req.body.company - Workplace / employer of user.
 * @property {string} req.body.profession - Profession user.
 * @returns {User} response - Void or Response
 */
const createUser = async (req) => {

  //dont save email in db
  let {
    emailAddress,
    password,
    username,
    ...rest
  } = req.body;

  const instanceToCreate = {
    emailAddress,
    password,
    username,
  }

  const safeData = {
    emailAddress,
    username,
  };

  let userQuery = {
    emailAddress
  };

  let foundUser = await User.findOne(userQuery);

  //----------------------------------------------------------------------------------------------

  if (foundUser)
    throw new Error('AlreadyExists');

  // If user does not exist and needs to be created
  let userInst = _.omit(
    req.body,
    ['password']
  );

  Object.assign(
    userInst,
    {
      ...instanceToCreate
    }
  );

  userInst.password = await bcrypt.hash(password, +SALT_ROUNDS);

  const userDocument = await User.Create(userInst, req.header);

  const user = userDocument
    .safeModel()
    .toObject();

  accessToken = signAndReturnJWT({
    ...user
  });

  return { accessToken, user };
}

/**
 * Login Administrator
 * @property {string} req.body.emailAddress - Email of the user.
 * @property {string} req.body.password - Password set by user.
 * @property {string} req.body.role - Role to register user for
 * @returns {User} response - Void or Response
 */
const loginUser = async (req) => {

  let {
    password,
    emailAddress,
    ...rest
  } = req.body;

  emailAddress = emailAddress
    .trim()
    .toLowerCase();

  const doc = await User.findOne({ emailAddress, ...rest });

  if (!doc)
    throw new Error('InvalidCredentials');

  const isValidPassword = bcrypt.compareSync(password, doc.password);
  if (!isValidPassword)
    throw new Error('InvalidCredentials');

  /** Assigns an isAdministrator flag to the token if the doc is an administrator */
  // doc.verifyAdministrator();

  const user = doc
  // .safeModel()
  // .toObject();

  accessToken = signAndReturnJWT({
    ...user
  });

  return { accessToken, user };
}

/**
 * Request otp for password recovery
 * @property {*} req.body.emailAddress - Email Address to reset pasword for
 * @returns {*} response - Details of job intialization
 */
const forgotPasswordUser = async (req) => {

  const {
    emailAddress,
    otp = await randomString.withAlphabets(6, true)
  } = req.body;

  let updated = await User.updateOne({
    emailAddress
  }, {
    $set: {
      'meta.otp': {
        code: otp,
        expiry: new Date(+new Date() + FORGOT_EXPIRY)
      }
    }
  });

  if (!updated.result.n)
    throw new Error('InvalidCredentials');

  return updated;
}

/**
   * Verify otp and update password
   * @property {*} req.body.otp - OTP for resetting password
   * @returns {*} response - Details of job intialization
   */
const verifyOTPForForgottenPassUser = async (req) => {
  const { otp } = req.body;
  if (!otp) {
    throw new Error('InvalidCredentials');
  }
  const retreived = await User.findOne({
    'meta.otp.code': otp,
    'meta.otp.expiry': {
      $lte: new Date(+new Date() + forgotPassExpiry)
    }
  });

  // Rejection if OTP's incorrect or expired
  if (!retreived) {
    let { Error: { error, status } } = new ErrorsFactory(invalidCredentials);
    throw new Error(status)
  }

  const newCode = await randomString.withAlphabets(6, true);
  const { _id } = retreived;

  let codeUpdated = await User.updateOne({ _id }, {
    $set: {
      'meta.otp.code': newCode
    }
  });
  return newCode;
}

const resetPasswordUser = async (req) => {
  const { otp, password } = req.body;
  if (!otp) {
    throw new Error('InvalidCredentials');
  }
  let retreived = await User.findOne({
    'meta.otp.code': otp,
    'meta.otp.expiry': {
      $lte: new Date(+new Date() + forgotPassExpiry)
    }
  });

  // Rejection if OTP's incorrect or expired
  if (!retreived) {
    throw new Error('InvalidCredentials');
  }

  const newPassword = await bcrypt.hash(password, saltRounds);
  const { _id } = retreived;

  const updated = await User.updateOne({ _id }, {
    $set: {
      'meta.otp.expiry': 0,
      'meta.otp.code': null,
      password: newPassword
    }
  })

  return updated
}
module.exports = {
  createUser,
  loginUser,
  forgotPasswordUser,
  verifyOTPForForgottenPassUser,
  resetPasswordUser,
}
