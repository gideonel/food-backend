import Restaurant from '../models/Restaurant.js';
import axios from 'axios';

// Fetch all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};

// Search restaurants by name, city, or state
export const searchRestaurants = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const results = await Restaurant.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { city: new RegExp(query, 'i') },
        { state: new RegExp(query, 'i') }
      ]
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching restaurants', error });
  }
};

// Fetch live nearby restaurants using Google Places API
export const getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${API_KEY}`;

    const response = await axios.get(googlePlacesUrl);
    const restaurants = response.data.results.map((place) => ({
      name: place.name,
      address: place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      rating: place.rating || 'No rating',
      image: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
        : 'https://via.placeholder.com/150',
    }));

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live restaurants', error });
  }
};
