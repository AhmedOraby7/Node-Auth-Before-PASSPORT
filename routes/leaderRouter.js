const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');

const Leader = require('../models/leaders');
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
       Leader.find({})
           .then((leaders) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'text/html');
               res.json(leaders);
           },(err) => next(err))
           .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Leader.create(req.body)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(leader);
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT Operation not supported on leaders');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Leader.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(resp);
            },(err) => next(err))
            .catch((err) => next(err))
    });


leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leader.findById(req.param.leaderId)
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(leaders);
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST Operation not supported on promotion ' + req.params.leaderId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Leader.findByIdAndUpdate(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(leader);
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Leader.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(resp);
            },(err) => next(err))
            .catch((err) => next(err))
    });


module.exports = leaderRouter;