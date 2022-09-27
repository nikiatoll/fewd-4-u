const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const menuController = require("../controllers/menu")

const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/restaurantList", ensureAuth, menuController.getRestaurantList);
router.get("/createRestaurant", menuController.getAddRestaurant);
router.get("/createRecipe/:id", menuController.getAddRecipe);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
