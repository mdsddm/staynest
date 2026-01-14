const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { log } = require("console");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/staynest';
// requiring routes
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")


main().then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);



// Directory Route
app.get("/", (req, res) => {
    res.send("<h1>Home directory</h1>");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)



// Using ExpressError
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});
// middleware to handle error 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log('app is listening on port 8080');
});