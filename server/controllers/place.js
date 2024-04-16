const https = require("https");
var ObjectID = require("mongodb").ObjectID;
var Place = require("../models/place");
var Transaction = require("../models/transaction");
const { sendResp } = require("../helpers/request");

const API_KEY = "AIzaSyA74jvNet0DufU8aoTe39dELLy2rVMeuos";
const PLACE_DETAIL_API =
  "https://maps.googleapis.com/maps/api/place/details/json?key=" +
  API_KEY +
  "&place_id=";

exports.updateRandom = async (req, res) => {
  const count = await Place.count();
  var random = Math.floor(Math.random() * count);
  Place.findOne()
    .skip(random)
    .then((p) => {
      https
        .get(PLACE_DETAIL_API + p.place_id, (resp) => {
          let data = "";
          resp.on("data", (chunk) => {
            data += chunk;
          });
          resp.on("end", async () => {
            const ret = JSON.parse(data);
            if (ret.status == "OK") {
              const result = ret.result;
              if (result.rating) {
                p.rating = result.rating;
              }
              if (result.name) {
                p.name = result.name;
              }
              if (result.icon) {
                p.icon = result.icon;
              }
              if (result.photos) {
                let photos = [];
                for (let pho of result.photos) {
                  const photo =
                    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=" +
                    pho.width +
                    "&photoreference=" +
                    pho.photo_reference +
                    "&key=" +
                    API_KEY;
                  photos.push(photo);
                }
                p.photos = photos;
              }
              if (result.types) {
                p.types = result.types;
              }
            }
            await Place.findOneAndUpdate({ _id: p._id }, p, { upsert: true });
            res.send(p);
          });
        })
        .on("error", (err) => {
          console.log("Error: " + err.message);
        });
    })
    .catch((err) => {
      if (err) return resp.json(err);
    });
};

exports.findList = (req, resp) => {
  Place.find({}, "_id place_id icon name address lat lng rating photos types")
    .sort("-created_at")
    .then((places) => {
      return sendResp(resp, places);
    })
    .catch((err) => {
      if (err) return resp.json(err);
    });
};

exports.getDetail = async function (req, resp) {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return resp.status(200).json({ msg: "Place Id is not valid" });
  }
  const p = await Place.findById(id);
  if (!p) {
    return resp.status(200).json({ msg: "No Place Found" });
  }
  const transactions = await Transaction.find(
    { place: p._id },
    "_id title price date category",
  );
  p.transactions = transactions;
  return sendResp(resp, p);
};
exports.upsert = async function (req, resp) {
  var { place_id, name, address, lat, lng } = req.body;
  const place = {
    place_id,
    name,
    address,
    lat,
    lng,
  };
  let p = await Place.findOne({ place_id: place.place_id });
  if (!p) {
    p = Place(place);
    await p.save();
  } else {
    p.name = place.name;
    p.address = place.address;
    p.lat = place.lat;
    p.lng = place.lng;
    await Place.findOneAndUpdate({ _id: p._id }, p, { upsert: true });
  }
  return sendResp(resp, p);
};
