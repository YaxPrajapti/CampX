mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: campground.geometry.coordinates,
    zoom: 14,
});

const popup = new mapboxgl.Popup({ offset: 25, focusAfterOpen:true, closeOnMove:true, closeOnClick:true, closeButton:false }).setText(
    `${campground.location}`
);

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);