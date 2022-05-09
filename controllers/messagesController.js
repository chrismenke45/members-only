const { body, validationResult } = require('express-validator');
const Message = require('../models/message')


exports.index = (req, res, next) => {
    Message.find({}, 'text timestamp user')
        .collation({ locale: "en" })
        .sort({ timestamp: -1 })
        .populate('user')
        .exec(function(err, message_list) {
            if (err) { return next(err); }
            res.render('messages', { title: 'Pik Pak', message_list: message_list })
        })
}
exports.create_message_get = (req, res, next) => {
    res.render('message_form', { title: "Post", message: null, errors: null })
}
exports.create_message_post = [

    body('text', 'Your message must be under 1000 characters').trim().isLength({ min: 1, max: 1000 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('message_form', { title: "Post", message: req.body, errors: errors.array() });
            return;
        }
        else {
            let message = new Message(
                {
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

        res.render('message_delete', { title: 'Delete Post', message: thismessage, errors: null})

    })
}
exports.delete_message_post = (req, res, next) => {
    Message.findByIdAndRemove(req.params.id, function deleteMessage(err) {
        if (err) { return next(err); }
        res.redirect('/messages')
    })
}