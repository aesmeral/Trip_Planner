function initMap(x,y) {
    var latCoord = parseFloat(x);
    var lngCoord = parseFloat(y);
    var coords = {lat: latCoord, lng: lngCoord};
    var map = new google.maps.Map(document.getElementById('map'), 
    {
      zoom: 12,
      center: coords
    });

    return map;
};

var markerArray = []; // keeps track of all active markers, helps for deletion
var startLngLat = [];
var endLngLat = [];
var startingAddress = [];
var endingAddress = [];

function addMarker(mainMap, mArray){
    var element = document.getElementById('dropdown');
    var value = element.options[element.selectedIndex].value;
    var split_value = value.split(',')
    //console.log(split_value[0]);
    //console.log(split_value[1]);
    var myLatLng = {lat: parseFloat(split_value[0]), lng: parseFloat(split_value[1])};
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: mainMap
    });
    if(startLngLat.length > 0)
    {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay =  new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(mainMap);
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    }
    map.panTo(myLatLng)
    markerArray.push(marker);

    return marker;
}

// Sets the map on all markers in the array.
function setMapOnAll(map, mArray) {
    for (var i = 0; i < mArray.length; i++) {
          mArray[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(map, mArray) {
    setMapOnAll(null, mArray);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers(map, mArray) {
    clearMarkers(map, mArray);
    mArray = [];
    return mArray;
}

function dropDownList(){
    var select = document.getElementById('dropdown');
    var newOptions = ['Irvine', 'West Covina', 'Los Angeles'];
    var valueOptions = [[33.6857, -117.8259],[34.0686, -117.9390], [34.0522, -118.2437]]
    for(var i = 0; i < newOptions.length; i++)
    {
        var option = document.createElement("option");
        option.text = newOptions[i];
        option.value = valueOptions[i];
        select.appendChild(option);
    }
}

function test(map)
{
    $.ajax({
        type: "GET",
        url: 'http://localhost:5000/getData',
        dataType: 'json',
        success: test2,
        error: function() {
            alert('error');
        }
    });
}
function test2(data){
    for(var i = 0; i < data[0]['legs'].length; i++)
    {
        startLngLat.push(data[0]['legs'][i]['start']['latLong']);
        endLngLat.push(data[0]['legs'][i]['end']['latLong']);
        startingAddress.push(data[0]['legs'][i]['start']['address']);
        endingAddress.push(data[0]['legs'][i]['end']['address']);
    }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay){
    var waypts = [];
    for(var i = 0; i < startingAddress.length; i++)
    {
        waypts.push({location: startingAddress[i], stopover: true});
    }
    directionsService.route({
        origin: startingAddress[0],
        destination: endingAddress[endingAddress.length - 1],
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, function(response, status){
            if(status == 'OK')
            {
                console.log(response);
                directionsDisplay.setDirections(response);
            }
            else window.alert('Direction request failed due to ' + status);
    });
}

function printData(){
    for(var i = 0; i < startLngLat.length; i++)
    {
        console.log(startLngLat[i]);
        console.log(endLngLat[i]);
        console.log(startingAddress[i]);
        console.log(endingAddress[i]);
    }
    console.log(startLngLat.length)
}