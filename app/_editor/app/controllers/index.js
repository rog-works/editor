'use strict'

let router = require('express').Router();

router.get('/', (request, response) => {
	response.sendFile('/opt/app/_editor/app/views/index.html');
});

module.exports = router;