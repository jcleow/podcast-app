import { hashPassword, convertUserIdToHash } from '../helper.mjs';

export default function users(db) {
  // Renders a form that will create a new user
  const newForm = async (req, res) => {
    res.render('register/newRegistrationForm');
  };

  const create = async (req, res) => {
    // Create a temp data var to capture all errors to be rendered on the registration page
    const data = {};
    data.previousValues = req.body;
    // set both username and email to be valid by default
    data.isUsernameValid = 'true';
    data.isEmailValid = 'true';

    try {
    // First check if the username already exists
      const selectAnyExistingUsername = await db.User.findAll({
        where: {
          username: req.body.username,
        },
      });
      if (selectAnyExistingUsername.length > 0) {
        console.log('Username already exists');
        data.isUsernameValid = false;
      }
      // Next check if email already exists
      const selectAnyExistingEmail = await db.User.findAll({
        where: {
          email_address: req.body.emailAddress,
        },
      });
      if (selectAnyExistingEmail.length > 0) {
        console.log('Email already exists');
        data.isEmailValid = false;
      }

      // If either username or email are false, re-render the form with the input data
      if (data.isUsernameValid === false || data.isEmailValid === false) {
        res.render('register/createNewUserForm', data);
        return;
      }

      // If username and usernames are both unique...proceed to create a new user
      // Remember to hash the password before storing it into the db
      const hashedPassword = hashPassword(req.body.password);

      const {
        firstName, lastName, username, emailAddress,
      } = req.body;
      const newUserDetails = await db.User.create({
        first_name: firstName,
        last_name: lastName,
        username,
        email_address: emailAddress,
        password: hashedPassword,
      }, {
        returning: ['id'],
      });
      // check if returning id only returns the id or the newUserDetail instance

      // if user uploaded a profile picture
      if (req.file) {
        newUserDetails.profile_pic = req.file.location;
        await newUserDetails.save();
      }

      // After successful creation of the user, we want the user to be logged in
      const hashedUserIdString = convertUserIdToHash(newUserDetails.id);
      res.cookie('loggedInHash', hashedUserIdString);
      res.cookie('loggedInUserId', newUserDetails.id);
    } catch (error) {
      console.log(error);
    }
    res.redirect('/');
  };
  return { newForm, create };
}
