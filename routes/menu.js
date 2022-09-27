const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const menuController = require("../controllers/menu")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/:id", menuController.getRestaurant);
router.get("/recipe/:id", menuController.getRecipe);

router.post("/createRestaurant", upload.single("file"), menuController.createRestaurant);
router.post("/createRecipe/:id", upload.single("file"), menuController.createRecipe);

router.put("/likeRestaurant/:id", menuController.likeRestaurant);
router.put("/likeRecipe/:id", menuController.likeRecipe);

router.delete("/deleteRecipe/:id", menuController.deleteRecipe);
router.delete("/deleteRestaurant/:id", menuController.deleteRestaurant);

module.exports = router;