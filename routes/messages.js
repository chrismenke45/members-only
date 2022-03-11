var express = require('express');
var router = express.Router();


var messages_controller = require('../controllers/messagesController');

//get for messages
router.get('/', messages_controller.index)
//get for create message
router.get('/create', messages_controller.create_message_get)
//post for create message
router.post('/create', messages_controller.create_message_post)

router.get('/:id/delete', messages_controller.delete_message_get)

router.post('/:id/delete', messages_controller.delete_message_post)

module.exports = router;


