const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const mongoose = require('mongoose');
const cors = require('./cors');


const Favorites = require('../models/favorite');


const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({})
            .populate('dishes','user')
            .then((Favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id})
            .then((favorites) => {
                if(!favorites) {
                    Favorites.create({})
                        .then((favorites) => {
                            favorites.user = req.user._id;
                            favorites.dishes = req.body;
                            favorites.save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                } else {
                    for(var i = 0; i < req.body.length; i++) {
                        dishId = req.body[i]._id;
                        if(favorites.dishes.indexOf(dishId) === -1) {
                            favorites.dishes.push(dishId);
                        }
                        favorites.user = req.user._id;
                    }
                    favorites.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({user: req.user._id})
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id})
            .then((favorites) => {
                if(!favorites) {
                    Favorites.create({})
                        .then((favorites) => {
                            favorites.user = req.user._id;
                            favorites.dishes = req.params.dishId;
                            favorites.save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                }else {
                    if(favorites.dishes.indexOf(req.params.dishId) === -1){
                        favorites.dishes.push(req.params.dishId);
                        favorites.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    }else {
                        res.statusCode = 403;
                        res.end('This dish already exists on your favorite list');
                    }
                }
            })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id })
            .then((favorites) => {
                const index = favorites.dishes.indexOf(req.params.dishId);
                if(index !== -1) {
                    favorites.dishes.splice(index, 1);
                    favorites.save()
                        .then((favorites) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites.dishes);
                        },(err) => next(err))
                }else {
                    err = new Error('Dish' + req.params.dishId + 'Not Found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;

