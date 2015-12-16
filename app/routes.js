/**
  * Routing for the Application with REST API services for mongoose models.
  **/
var Order     = require('./models/order.js');
var shortid = require('shortid'); // To generate random ID for the each order


module.exports = function(app, router, socket, io){
    app.use('/api/v1', router); 
    router.use(function(req, res, next) {
        next(); 
    });
    router.route('/orders')
    .post(function(req, res) {
        var order = new Order();
        order.orderId= '#'+shortid.generate();
        order.source= req.body.source;
        order.destination= req.body.destination;
        order.email= req.body.email;
        order.contact= req.body.contact;
        order.itemInfo= req.body.itemInfo;
        order.updatedAt = Date.now();
        order.save(function(err) {
            if (err)
                res.send(err);
            io.sockets.emit('OrderInserted', { order:order, message: 'New Order is created..!' } );
            res.json({ message: 'New Order is created..!' });
        });
    })
    .get(function(req, res) {
        Order.find()
            .sort('-updatedAt')
            .exec(function(err, orders) { 
                if (err)
                    res.send(err);
                res.json(orders);
            });
    });
    router.route('/order')
    .get(function(req, res) {
        Order.findOne({orderId:req.query.orderId}, function(err, order) {
            if (err)
                res.send(err);
            res.json(order);
        });
    })
    .put(function(req, res) {
        Order.findOne({orderId:req.body.orderId}, function(err, order) {
            if (err)
                res.send(err);
            order.source= req.body.source;
            order.destination= req.body.destination;
            order.email= req.body.email;
            order.contact= req.body.contact;
            order.itemInfo= req.body.itemInfo;
            order.updatedAt = Date.now();
            order.save(function(err) {
                if (err)
                    res.send(err);
                io.sockets.emit('listUpdated', { message: 'Order is Updated..!' });
                res.json({ message: 'Order is Updated..!' });
            });
        });
    })
    .delete(function(req, res) {
        Order.remove({orderId:req.query.orderId}, function(err){
            if (err)
                res.send(err);
            io.sockets.emit('listUpdated',{ message: 'Order is successfully Deleted..!' });
            res.json({ message: 'Order is successfully Deleted..!' });
        })
    });
}