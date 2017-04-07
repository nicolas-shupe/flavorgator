/*'use strict;'

const functions = require('firebase-functions');

const moment = require('moment');

const cors = require('cors') ({origin: true});

exports.date = functions.https.onRequest((req, res => {
    if (req.method == 'PUT') {
        res.statusCode('403').send();
    }

    cors.onRequest(req, res, () => {
        let format = req.query.format;
        if (!format) {
            format = req.body.format;
        }
        const formattedDate = moment().format(format);
        console.log('Sending Formatted date:', formattedDate);
        res.status(200).send(formattedDate);
    });
}));*/