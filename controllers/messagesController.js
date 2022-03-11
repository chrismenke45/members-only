const { body, validationResult } = require('express-validator');
//const message = require('../models/message');
const Message = require('../models/message')

exports.index = (req, res, next) => {
    Message.find({}, 'title text timestamp user')
        .collation({ locale: "en" })
        .sort({ timestamp: -1 })
        .populate('user')
        .exec(function(err, message_list) {
            if (err) { return next(err); }
            res.render('messages', { title: 'Messages', message_list: message_list })
        })
}
exports.create_message_get = (req, res, next) => {
    res.render('message_form', { title: "Create Message", message: null, errors: null })
}
exports.create_message_post = [
    body('title', 'Title must not be empty and be less than 100 Characters').trim().isLength({ min: 1, max: 100 }).escape(),
    body('text', 'Your message must be under 1000 characters').trim().isLength({ min: 1, max: 1000 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('message_form', { title: "Create Message", message: req.body, errors: errors.array() });
            return;
        }
        else {
            console.log(req.body)
            let message = new Message(
                {
                    title: req.body.title,
                    text: req.body.text,
                    user: req.body.userId,
                })
            message.save(function (err) {
                if (err) { return next(err); }
                res.redirect('/messages')
            })
        }

    }
];
exports.delete_message_get = (req, res, next) => {
    Message.findById(req.params.id).populate('user').exec(function(err, thismessage) {
        if (err) { return next(err); }

            res.render('message_delete', { title: 'Delete Message', message: thismessage, errors: null})

    })
}
exports.delete_message_post = (req, res, next) => {
    Message.findByIdAndRemove(req.params.id, function deleteMessage(err) {
        if (err) { return next(err); }
        res.redirect('/messages')
    })
}