const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
const notFound= require('../errors/notFound')

// Validation middleware for checking if a property exists and is not empty
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName] !== undefined && data[propertyName] !== "") {
      return next();
    }
    next({ status: 400, message: `Order must include a ${propertyName}` });
  };
}

// Validation middleware for checking if the dishes property exists, is an array, and is not empty
function dishesValidation(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
  next();
}

// Validation middleware for checking if a dish quantity property is valid
function dishQuantityValidation(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  for (let i = 0; i < dishes.length; i++) {
    const quantity = dishes[i].quantity;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
}

// POST /orders handler
function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(), // Assign a new ID here
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder); 
  res.status(201).json({ data: newOrder });
}

// Validation middleware for checking if orderId exists
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    next();
  } else {
    next({
      status: 404,
      message: `Order with id '${orderId}' not found.`,
    });
  }
}
//CTHIS FUNCTION READS THE ORDERID REQUESTED
function read(req,res){
  res.json({data: res.locals.order})
}

// Validation middleware for checking if ID IS DIFFERENT OF ORDERID
function orderIdMatches(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;

  if (id && id !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }

  next();
}

// Validation middleware for checking if  value of status is one of the following:
function statusValueIsValid(req,res,next){
  const {data:{status}={}}=req.body;
  const validValues= ["pending", "preparing","out-for-delivery","delivered"];
  if(validValues.includes(status)){
    next()
  }
  next({
    status:400,
    message:'Order must have a status of pending, preparing, out-for-delivery, delivered'
  })
}
// Validation middleware for checking if status is delivered or not. 
function isDelivered(req,res,next){
  const {data:{status}={}}=req.body;
  if(status === "delivered"){
    next({
      status:400,
      message:'A delivered order cannot be changed'
    })
  }else{
    next()
  }
}


// Validation middleware allows the put request be successful no matter if id is empty, undefined or missing
function validId(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;

  if (id !== undefined && id !== orderId) {
    console.log(`Order id does not match route id. Order: ${id}, Route: ${orderId}`);
  }

  // Allow the PUT request to proceed regardless of whether the ids match or not
  next();
}


// function allows to make the PUT request 
function update(req,res){
  
 const order = res.locals.order;
 const {data:{deliverTo,mobileNumber,status,dishes}={}}=req.body;
  order.deliverTo= deliverTo;
  order.mobileNumber= mobileNumber;
  order.status= status;
  order.dishes=dishes;
  res.json({data:order})
 }

//CHECKS IF ORDER STATUS IS NOT PENDING
function isPending(req, res, next) {
  const { orderId } = req.params;
  const order = res.locals.order;

  if (order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }

  next();
}


 //DELETES THE ORDERID ORDER
function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);

  if (index !== -1) {
    orders.splice(index, 1);
    res.sendStatus(204);
  } else {
    next({
      status: 404,
      message: `Order with id '${orderId}' not found.`,
    });
  }
}

// SHOWS ALL OF THE CURRENT ORDERS 
function list(req,res){
  res.json({data:orders})
}
module.exports = {
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishesValidation,
    dishQuantityValidation,
    create,
  ],
  read:[orderExists,read],
  update:[
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishesValidation,
    dishQuantityValidation,
    validId,
   orderExists,
    isDelivered,
  statusValueIsValid,
    orderIdMatches,
    update,],
  delete:[orderExists,isPending,destroy],
  list,
};
