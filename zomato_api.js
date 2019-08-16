var express = require('express');
var app = express();
var zomato = require('zomato');
var ejs = require('ejs');

app.set("view engine", "ejs")

app.use(express.static(__dirname + "views"))
const client = zomato.createClient({userKey: '810f08bc7bcda63583223f45d2905ec4'})




app.get("/locations/:geocode", (req, res)=>{
    let name = req.params.geocode;
    // console.log(name);
    client.getLocations({query: name,}, (err, result) =>{
    	// console.log(result)
        if(!err){
            let main_data = JSON.parse(result).location_suggestions;

            let latitude = JSON.stringify (main_data[0].latitude);
            let longitude = JSON.stringify (main_data[0].longitude);
            // console.log(latitude);
            // console.log(longitude);
            client.getGeocode({lat:latitude, lon:longitude},(err, result)=>{
                if(!err){
                    // console.log(result);
                    // res.send(result);
                    let data = JSON.parse(result).nearby_restaurants;
                    // console.log(data);
                    var restaurant_list = [];
                    for(var i of data){
                    	// console.log(i)
                        let Dict = {
                            name: i.restaurant.name,
                            address: i.restaurant.location.address,
                            city: i.restaurant.location.city,
                            locality : i.restaurant.location.locality,
                            average_cost_for_two: i.restaurant.average_cost_for_two,
                            price_range: i.restaurant.price_range,
                            has_online_delivery: i.restaurant.has_online_delivery,
                            cuisines: i.restaurant.cuisines,
                            featured_image: i.restaurant.featured_image
                        }
                        // console.log(Dict);
                        restaurant_list.push(Dict)
                    }

                    // console.log(restaurant_list)
                    res.render('zomato.ejs', {data: restaurant_list})
                }else{
                    console.log(err);
                }
            })
        }else{
            console.log(err);
        }
    })
});



var server = app.listen(3000,()=>{
	console.log('cod is working');
})
