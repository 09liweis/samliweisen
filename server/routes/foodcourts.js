var express = require("express");
var router = express.Router();

const FoodCourt = require("../models/foodcourt");
const Restaurant = require("../models/restaurant");

const { sendResp, sendErr, sendRequest } = require("../helpers/request");

router.route("/").get(async (req, resp) => {
  const foodcourts = await FoodCourt.find();
  sendResp(resp, {
    message: "Welcome to foodcourts API",
    foodcourts,
  });
});

async function getPlaceDetail(place_id) {
  const API_KEY = process.env["GOOGLE_API_KEY"] || "";
  const PLACE_DETAIL_API =
    "https://maps.googleapis.com/maps/api/place/details/json?key=" +
    API_KEY +
    "&place_id=" +
    place_id;
  const {
    body: { result },
  } = await sendRequest({ url: PLACE_DETAIL_API });
  const foodcourtVO = {
    name: result.name,
    address: result.formatted_address,
    rating: result.rating,
    place_id,
    loc: result.geometry.location,
  };
  return foodcourtVO;
}

router.route("/").post(async (req, resp) => {
  const { place_id } = req.body;
  const found = await FoodCourt.findOne({ place_id });
  const foodcourtVO = await getPlaceDetail(place_id);
  if (found) {
    await FoodCourt.findOneAndUpdate({ place_id }, foodcourtVO, {
      upsert: true,
    });
    return sendResp(resp, { msg: "Foodcourt already exists" });
  }
  const foodcourt = new FoodCourt(foodcourtVO);
  await foodcourt.save();
  return sendResp(resp, {
    message: "Foodcourt added successfully",
    foodcourt,
  });
});

router.route("/:id").put(async (req, resp) => {});

router.route("/:id").delete(async (req, resp) => {});

router.route("/:id").get(async (req, resp) => {
  const foodcourt_id = req.params.id;
  const restaurants = await Restaurant.find({ foodcourt_id });
  sendResp(resp, {
    foodcourt: foodcourt_id,
    restaurants,
  });
});

router.route("/:foodcournt_id/restaurants").post(async (req, resp) => {
  const { foodcourt_id } = req.params;
  const { place_id } = req.body;
  
  const restaurantVO = await getPlaceDetail(place_id);
  
  const found = await Restaurant.findOne({ place_id, foodcourt_id });
  if (found) {
    await Restaurant.findOneAndUpdate({ place_id,foodcourt_id }, {restaurantVO,...foodcourt_id}, {
      upsert: true,
    });
    return sendResp(resp, { msg: "Restaurant already exists" });
  }

  const restaurant = new Restaurant({restaurantVO,...foodcourt_id});
  await restaurant.save();
  return sendResp(resp, {
    message: "Foodcourt added successfully",
    restaurant,
  });
  
});

router.route("/:foodcourt_id/restaurants/:id").put(async (req, resp) => {
  const { foodcourt_id, id } = req.params;
});

router.route("/:foodcourt_id/restaurants/:id").delete(async (req, resp) => {
  const { foodcourt_id, id } = req.params;
});

module.exports = router;
