const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const passport = require('../passport').passport
const bcrypt = require('bcryptjs')

let findUser = async function (username) {
    let usernameAlreadyUser = await User.find({ 'username': username })
    return usernameAlreadyUser
}

exports.index = (req, res, next) => {
    res.redirect('/users/sign-up')
}
exports.sign_up_get = (req, res, next) => {
    res.render('user_signup', { title: 'Register', userInfo: undefined, errors: null })
}
exports.sign_up_post = [

    body('username').trim().isLength({ min: 1, max: 100 }).escape().withMessage('Username must be specified with more the 1 character and less then 100 characters.'),
    body('password', 'Password must not be empty').trim().isLength({ min: 1 }).escape(),
    body('confirm_password', 'Confirm Password must not be empty').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        let errors = validationResult(req);
        findUser(req.body.username)
            .then((usernameAlreadyUser) => {
                console.log(usernameAlreadyUser)
                if (usernameAlreadyUser.length !== 0) {
                    res.render('user_signup', { title: 'Register', userInfo: req.body, errors: [{ msg: 'Username already in use' }] });
                    return;
                }
            })
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('user_signup', { title: 'Register', userInfo: req.body, errors: errors.array() });
            return;
        } else
            if (req.body.password != req.body.confirm_password) {
                res.render('user_signup', { title: 'Register', userInfo: req.body, errors: [{ msg: 'Passords must match' }] });
                return;
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if (err) {
                        return next(err);
                    }
                    const user = new User({
                        username: req.body.username,
                        password: hashedPassword
                    }).save(err => {
                        if (err) {
                            return next(err);
                        }
                        res.redirect("/users/log-in");
                    });
                });
            }
    }
]
exports.log_in_get = (req, res, next) => {
    res.render('user_login', { title: 'Log In', user: undefined, errors: null })
}

exports.log_in_post = passport.authenticate("local", { successRedirect: "/", failureRedirect: "/" })

exports.log_out_get = (req, res) => {
    req.logout();
    res.redirect("/");
};

exports.upgrade_status_get = (req, res, next) => {
    res.render('user_upgrade_status', { title: 'Become Admin', errors: null })
}

exports.upgrade_status_post = (req, res, next) => {
    let updated_user
    if (req.body.upgradeCode === '1234') {
        updated_user = {
            username: req.user.username,
            password: req.user.password,
            admin: true,
            id: req.user._id
        }
    } else { //this is if 
        res.render('user_upgrade_status', { title: 'Become Admin', errors: [{ msg: 'invalid upgrade code' }] })

    }
    User.findByIdAndUpdate(req.user._id, updated_user, {}, function (err, theuser) {
        if (err) { return next(err); }
        // Successful - redirect to messages page
        res.redirect('/messages');
    });
}