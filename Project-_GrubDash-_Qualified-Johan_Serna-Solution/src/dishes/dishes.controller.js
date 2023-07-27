const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req,res){
  res.json({data: dishes})
}
// Validation middleware for checking if DATA HAS ALL PROPERTIES 
function bodyDataHas(propertyName){
   return function(req,res,next){
     const {data={}}=req.body;
     if(data[propertyName]){
       return next();
     }
     next({status:400, message:`Dish must include a ${propertyName}`});
   };
    }
//  CREATES A NEW DISH AND ASSIGNS A NEW ID 
function create(req,res){
  const {data: {name,description,price,image_url}={}}=req.body;
  const newDish={
    id: nextId(),
    name,
    description,
    price,
    image_url,
  }
  dishes.push(newDish)
  res.status(201).json({data: newDish})
}

// PRICE VALIDATION
function priceValidation(req,res,next){
  const {data: {price}={}}=req.body;
  if(!price||price <=0 || !Number.isInteger(price)){
    next({
      status:400,
      message: "Dish must have a price that is an integer greater than 0"
    })
  }
  next()
}
// // Validation middleware for checking if DISHID EXISTS 
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish= dishes.find((dish)=> dish.id===dishId)
  if (foundDish) {
    res.locals.dish = foundDish;
    next();
  } else {
    next({
      status: 404,
      message: `Dish with id '${dishId}' not found.`,
    });
  }
}

// READS THE DISHEID REQUESTED
function read(req,res){
  res.json({data: res.locals.dish})
}
// PUT /dishes/:dishId
function propertyContent(req, res, next) {
  const { data: { name, description, image_url } = {} } = req.body;
  if (!name || name === "" || !description || description === "" || !image_url || image_url === "") {
    next({
      status: 400,
      message: "Dish must include a name, description, and image_url",
    });
  } else {
    next();
  }
}

// PUT /dishes/:dishId
function update(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const { dishId } = req.params;

  // Check if the :dishId exists in the dishes data
  const existingDish = dishes.find((dish) => dish.id === dishId);
  if (!existingDish) {
    return next({
      status: 404,
      message: `Dish does not exist: ${dishId}.`,
    });
  }

  // Validate if the id in the body matches the :dishId in the route
  if (id && id !== dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }

  // Update the dish properties
  existingDish.name = name;
  existingDish.description = description;
  existingDish.price = price;
  existingDish.image_url = image_url;

  res.json({ data: existingDish });
}





module.exports= {
  list,
  create:[
    bodyDataHas('name'),
    bodyDataHas('description'),
    bodyDataHas('price'),
    bodyDataHas('image_url'),
    priceValidation,
    create,
  ],
  read:[dishExists,read],
  update:[ 
    dishExists,
    bodyDataHas('name'),
    bodyDataHas('description'),
    bodyDataHas('price'),
    bodyDataHas('image_url'),
    priceValidation,
   
    update]
}