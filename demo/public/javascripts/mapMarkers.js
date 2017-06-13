/**
 * Created by pallavidandane on 13/6/17.
 */

// Userlist data array for filling in info box
var wareHouseList = [];

// DOM Ready =============================================================
$(document).ready(function() {
//    initMap();
    // Populate the user table on initial page load
//    populateWareHouses();

});

// Functions =============================================================

var map;
//var myLatLng = {lat: 18.580085, lng: 73.738125};
var myLatLng, arrMarkers = [] ;
var wareHouses;

function initMap() {
    myLatLng = new google.maps.LatLng(18.580085, -73.738125);
    map = new google.maps.Map(document.getElementById('mymap'), {
        center: myLatLng,
        zoom: 10
    });
//    marker = new google.maps.Marker( {position: myLatLng, map: map} );
//    marker.setMap( map );

    populateWareHouses();
}
//function moveMarker( map, marker ) {
//    myLatLng.lat += 0.000100;
//    myLatLng.lng += 0.000100;
//    marker.setPosition( new google.maps.LatLng( myLatLng.lat, myLatLng.lng ) );
//    map.panTo( new google.maps.LatLng( myLatLng.lat, myLatLng.lng ) );
//}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//    infoWindow.setPosition(pos);
//    infoWindow.setContent(browserHasGeolocation ?
//        'Error: The Geolocation service failed.' :
//        'Error: Your browser doesn\'t support geolocation.');
//    infoWindow.open(map);
}

var choices = ["one", "two"];

function addInput(divName) {
    var select = $("#wareHouseCity");
    var unique = wareHouses.filter((set => f => !set.has(f.city) && set.add(f.city))(new Set));
    $.each(unique, function(a, b) {
        select.append($("<option/>").attr("value", b.city).text(b.city));
    });
//    $("#" + divName).append(select);
}

function placeMarkesrs(data) {
    for (i = 0; i < arrMarkers.length; i++) {
        arrMarkers[i].setMap(null);
    }
    arrMarkers = [];
    $.each(data, function(){
        myLatLng = new google.maps.LatLng( parseFloat(this.latitude),  parseFloat(this.longitude));
        var marker = new google.maps.Marker( {position: myLatLng, map: map} );
        marker.setMap(map);
        var infoWindow = new google.maps.InfoWindow({
            content: this.warehouseCode + ' <br> ' + this.area
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
        arrMarkers.push(marker);
    });
}

// Fill table with data
function populateWareHouses() {

    // Empty content string
    var tableContent = '';

    map = new google.maps.Map(document.getElementById('mymap'), {
        center: myLatLng,
        zoom: 3
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function() {
//            handleLocationError(true, infoWindow, map.getCenter());
        });
    }


    // jQuery AJAX call for JSON
    $.getJSON('/wareHouses/wareHouses', function( data ) {
        wareHouses = data;
        addInput();
        // For each item in our JSON, add a table row and cells to the content string
        placeMarkesrs(data);

    });


};

function filterWareHouses(keyName, element) {
//        var ele = $("#" + elementId);
    console.log(element);
    var value = element.value;

//    req.filter = {keyName : value};

//    var filtered = _.where(wareHouses, {keyName: value});
    var obj = {};
    obj[keyName] = value;

    $.getJSON('/wareHouses/filter',obj, function( data ) {
        placeMarkesrs(data);

    }, function(){

    });
}

function resetMarkers() {
    placeMarkesrs(wareHouses);
}
