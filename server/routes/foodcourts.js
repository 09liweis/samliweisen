var express = require("express");
var router = express.Router();

const FoodCourt = require("../models/foodcourt");
const Restaurant = require("../models/restaurant");

const { sendResp, sendErr } = require("../helpers/request");

router.route("/").get( async (req, resp) => {
  const foodcourts = await FoodCourt.find();
  sendResp(resp, {
    message: "Welcome to foodcourts API",
    foodcourts
  });
});

router.route("/").post( async (req, resp) => {
  
});

router.route("/:id").put( async (req, resp) => {
  
});

router.route("/:id").delete( async (req, resp) => {
  
});


router.route("/:id").get( async (req, resp) => {
  const foodcourt_id = req.params.id
  const restaurants = await Restaurant.find({ foodcourt_id });
  sendResp(resp, {
    foodcourt: foodcourt_id,
    restaurants
  });
});

router.route("/:foodcournt_id/restaurants").post( async (req, resp) => {
  const {foodcourt_id} = req.params;
  
});

router.route("/:foodcourt_id/restaurants/:id").put( async (req, resp) => {
  const {foodcourt_id, id} = req.params;
  
});

router.route("/:foodcourt_id/restaurants/:id").delete( async (req, resp) =>{
  const {foodcourt_id, id} = req.params;
})

module.exports = router;
