const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { log } = require("console");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/staynest';


main().then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

// basic route
app.get("/", (req, res) => {
    res.send("<h1>Home directory</h1>");
});
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// new route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));
// new post route
app.post("/listings", wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))
// edit put route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");
}))



// Using ExpressError
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
})
// middleware to handle error 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
})




app.listen(8080, () => {
    console.log('app is listening on port 8080');

})