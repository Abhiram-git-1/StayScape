document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");

  if (!mapDiv) return; 

  // Get data from HTML
  const coordinates = JSON.parse(mapDiv.dataset.coordinates);
  const locationName = mapDiv.dataset.location;
  const maptoken = mapDiv.dataset.token;

  mapboxgl.accessToken = maptoken;

  //Create map
  const map = new mapboxgl.Map({
    container: mapDiv,
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9,
  });

  //Add navigation controls (zoom buttons)
  map.addControl(new mapboxgl.NavigationControl());

  //Marker with popup
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
  <div style="font-size:14px">
    <strong>${locationName}</strong><br/>
    <span style="color:gray">View location</span>
  </div>
`);

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  //Smooth animation
  map.flyTo({
    center: coordinates,
    zoom: 10,
    essential: true,
  });
});
