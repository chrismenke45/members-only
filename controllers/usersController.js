const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const passport = require('../passport').passport
const bcrypt = require('bcryptjs')

exports.index = (req, res, next) => {
    res.redirect('/users/sign-up')
}
exports.sign_up_get = (req, res, next) => {
    res.render('user_signup', { title: 'Register', userInfo: undefined, errors: null })
}
exports.sign_up_post = [

    body('first_name').trim().isLength({ min: 1, max: 100 }).escape().withMessage('First Name must be specified with more the 1 character and less then 100 characters.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1, max: 100 }).escape().withMessage('Last Name must be specified with more the 1 character and less then 100 characters.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('username').trim().isLength({ min: 1, max: 100 }).escape().withMessage('First Name must be specified with more the 1 character and less then 100 characters.'),
    body('password', 'Password must not be empty').trim().isLength({ min: 1 }).escape(),
    body('confirm_password', 'Confirm Password must not be empty').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        let errors = validationResult(req);
        let userNameTaken
         User.find({ 'username': req.body.username }).exec(function (err, theusername) {
                if (err) { return next(err); }
                userNameTaken = theusername.length
                console.log(userNameTaken)
            })
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('user_signup', { title: 'Register', userInfo: req.body, errors: errors.array() });
            return;
        } else
        if (req.body.password != req.body.confirm_password) {
            res.render('user_signup', { title: 'Register', userInfo: req.body, errors: [{ msg: 'Passords must match' }] });
            return;
        } else
        if (!userNameTaken) {
            res.render('user_signup', { title: 'Register', userInfo: req.body, errors: [{ msg: 'Username already in use' }] });
            return;
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    return next(err);
                }
                const user = new User({
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    username: req.body.username,
                    password: hashedPassword
                }).save(err => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect("/users/log-in");
                });
            });
            /*
            const user = new User({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                username: req.body.username,
                password: req.body.password
            }).save(err => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
            */
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
    res.render('user_upgrade_status', { title: 'Upgrade Membership', errors: null })
}

exports.upgrade_status_post = (req, res, next) => {
    let updated_user
    if (req.body.upgradeCode === '1234') {
        updated_user = {
            first_name: req.user.first_name,
            family_name: req.user.family_name,
            username: req.user.username,
            password: req.user.password,
            admin: req.user.admin,
            member: true,
            id: req.user._id
        }
    } else if (req.body.upgradeCode === '0987') {
        updated_user = {
            first_name: req.user.first_name,
            family_name: req.user.family_name,
            username: req.user.username,
            password: req.user.password,
            admin: true,
            member: true,
            id: req.user._id
        }
    } else { //this is if 
        res.render('user_upgrade_status', { title: 'Upgrade Membership', errors: [{ msg: 'invalid upgrade code' }] })

    }
    User.findByIdAndUpdate(req.user._id, updated_user, {}, function (err, theuser) {
        if (err) { return next(err); }
        // Successful - redirect to messages page
        res.redirect('/messages');
    });
}