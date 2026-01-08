const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/staynest';
main().then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect(MONGO_URL);
}


// basic route
app.get("/", (req, res) => {
    res.send("<h1>Hey, i am root</h1>");
})

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
});


app.listen(8080, () => {
    console.log('app is listening on port 8080');

})