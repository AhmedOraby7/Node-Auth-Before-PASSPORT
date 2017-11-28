const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotion = require('../models/promotions');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promotion.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(promotions);
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.create(req.body)
            .then((promotion) => {
                console.log("Promo Created" + promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(promotion);
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT Operation not supported on Promotions');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        promotion.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(resp)
            },(err) => next(err))
            .catch((err) => next(err))
    });


promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(promo)
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST Operation not supported on promotion' + req.params.promoId);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoId , {
            $set: req.body
        }, {
            new: true
        })
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.json(promo)
        },(err) => next(err))
        .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.json(promo)
            },(err) => next(err))
            .catch((err) => next(err))
    });


module.exports = promoRouter;