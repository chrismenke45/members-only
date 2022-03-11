var express = require('express');
var router = express.Router();
var users_controller = require('../controllers/usersController');
/* GET users listing. */
router.get('/', users_controller.index)

router.get('/sign-up', users_controller.sign_up_get)

router.post('/sign-up', users_controller.sign_up_post)

router.get('/log-in', users_controller.log_in_get)

router.post('/log-in', users_controller.log_in_post)

router.get('/log-out', users_controller.log_out_get)

router.get('/upgrade-status', users_controller.upgrade_status_get)

router.post('/upgrade-status', users_controller.upgrade_status_post)

module.exports = router;
