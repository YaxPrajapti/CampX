
mapboxgl.accessToken = maptoken;
console.log(campground.geometry.coordinates)
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: campground.geometry.coordinates,
    zoom: 14,
});
const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);