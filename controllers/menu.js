const cloudinary = require("../middleware/cloudinary");
const Restaurant = require("../models/Restaurant");
const Recipe = require("../models/Recipe");

module.exports = {
    getRestaurantList: async (req, res) => {
        try {
            const restaurants = await Restaurant.find().sort({ createdAt: "desc"}).lean();
            res.render("restaurantList.ejs", {restaurants: restaurants});
        } catch (error) {
            console.log(error);
        }
    },
    getRestaurant: async (req, res) => {
        try {
            const restaurant = await Restaurant.findById(req.params.id)
            const recipes = await Recipe.find({ restaurant: req.params.id}).sort({createdAt: "desc"}).lean();
            res.render("restaurant.ejs", { restaurant: restaurant, recipes: recipes, user: req.user });
        } catch (error) {
            console.log(error);
        }
    },
    getRecipe: async (req, res) => {
        try {
            const recipe = await Recipe.findById(req.params.id);
            const restaurant = await Restaurant.find({ _id: recipe.restaurant })
            res.render("recipe.ejs", { recipe: recipe, user: req.user, restaurant: restaurant});
        } catch (error) {
            console.log(error);
        }
    },
    getAddRecipe: async (req, res) => {
        try {
            const restaurant = await Restaurant.findById(req.params.id);
            console.log(restaurant)
            res.render("addRecipe.ejs", { restaurant: restaurant, user: req.user });
        } catch (error) {
            console.log(error);
        }
    },
    getAddRestaurant: async (req, res) => {
        try {
            console.log("rendering add restaurant page")
            res.render("addRestaurant.ejs", { user: req.user });
        } catch (error) {
            console.log(error);
        }
    },
    createRestaurant: async (req, res) => {
        try {
            console.log(req.body)
            const result = await cloudinary.uploader.upload(req.file.path);
            
            await Restaurant.create({
                name: req.body.name,
                logo: result.secure_url,
                cloudinaryId: result.public_id,
                genre: req.body.genre,
                likes: 0,
                user: req.user,
            });
            console.log("Restaurant has been added");
            res.redirect("/restaurantList");
        } catch (error) {
            console.log(error);
        }
    },
    createRecipe: async (req, res) => {
        try {
            console.log(req.body)
            const result = await cloudinary.uploader.upload(req.file.path);

            await Recipe.create({
                name: req.body.name,
                image: result.secure_url,
                cloudinaryId: result.public_id,
                description: req.body.description,
                likes: 0,
                user: req.user,
                ingredients: req.body.ingredients,
                directions: req.body.directions,
                restaurant: req.params.id
            });
            console.log("Recipe created");
            res.redirect("/menu/"+req.params.id);
        } catch (error) {
            console.log(error);
        }
    },
    likeRestaurant: async (req, res) => {
        try {
            await Restaurant.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $inc: { likes: 1 },
                }
            );
            console.log("Likes +1");
            res.redirect(`/menu/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    likeRecipe: async (req, res) => {
        try {
            await Recipe.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $inc: { likes: 1 },
                }
            );
            console.log("Likes +1");
            res.redirect(`/menu/recipe/${req.params.id}`);
        } catch (err) {
            console.log(err);
        }
    },
    deleteRecipe: async (req, res) => {
        try {
            let recipe = await Recipe.findById({ _id: req.params.id });
            await cloudinary.uploader.destroy(recipe.cloudinaryId);
            await Recipe.remove({ _id: req.params.id });
            console.log("Deleted Recipe");
            res.redirect("/menu/"+recipe.restaurant);
        } catch (error) {
            console.log(error);
        }
    },
    deleteRestaurant: async (req, res) => {
        try {
            let restaurant = await Restaurant.findById({ _id: req.params.id });
            await cloudinary.uploader.destroy(restaurant.cloudinaryId);
            await Restaurant.remove({ _id: req.params.id });
            console.log("Deleted Restaurant");
            res.redirect("/restaurantList");
        } catch (error) {
            console.log(error);
        }
    },
}