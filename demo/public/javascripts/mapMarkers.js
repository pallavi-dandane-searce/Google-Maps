/**
 * Created by pallavidandane on 13/6/17.
 */

// Functions =============================================================

var map;
//var myLatLng = {lat: 18.580085, lng: 73.738125};
var myLatLng, arrMarkers = [], arrUserMarkers = [] ;
var wareHouses, categories, filterFields, categoryData, selectedCategory, objMarkersFilterQuery = {};

function initMap() {
    myLatLng = new google.maps.LatLng(18.580085, -73.738125);
    map = new google.maps.Map(document.getElementById('mymap'), {
        center: myLatLng,
        zoom: 3
    });
//    marker = new google.maps.Marker( {position: myLatLng, map: map} );
//    marker.setMap( map );
    getTemplates();
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

function addInput(divName, dataToAppend) {
    var select = $("#" + divName);
    var unique = dataToAppend.filter((set => f => !set.has(f[divName]) && set.add(f[divName]))(new Set));
    select.append($("<option/>").attr("value", "").text(""));
    $.each(unique, function(a, b) {
        select.append($("<option/>").attr("value", b[divName]).text(b[divName]));
    });
//    $("#" + divName).append(select);
}

function placeMarkesrs(data) {
    for (i = 0; i < arrMarkers.length; i++) {
        arrMarkers[i].setMap(null);
    }
    arrMarkers = [];
    $.each(data, function(){
        myLatLng = new google.maps.LatLng( parseFloat(this.latitude?this.latitude:this.Latitude),  parseFloat(this.longitude?this.longitude:this.Longitude));
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

function createFilter() {
    var divFilter = $("#filter");
    divFilter.empty();
//    divFilter.append("<div class='filter_group'><label>Category</label><select id='category' onchange='loadFilter(this)' ></select></div>");

    var ele;
    $.each(filterFields, function(a, b) {
        divFilter.append("<div class='filter_group'><label>" + b.label + "</label><select id=" + b.key + " onchange=filterMarkerData('"  + selectedCategory + "','" + b.key + "',this)></select></div>");
        //divFilter.append("");
//        divFilter.append("");
        addInput(b.key, categoryData);
    });
}

function getTemplates() {
    // jQuery AJAX call for JSON
    $.getJSON('/templates/templates', function( data ) {
        categories = data;
        var select = $("#category");
        select.append($("<option/>").attr("value", "").text(""));
//    var unique = dataToAppend.filter((set => f => !set.has(f[divName]) && set.add(f[divName]))(new Set));
        for (i = 0; i < categories.length; i++) {
            select.append($("<option/>").attr("value", categories[i]).text(categories[i]));
        }
//    $.each(categories, function(a, b) {
//        select.append($("<option/>").attr("value", b).text(b));
//    });
    });

};

function getData(dbName) {
    $.getJSON('/wareHouses/getData',{"docType":dbName}, function( data ) {
        categoryData = data;
        createFilter();
    });

}

function loadFilter(element) {
    var value = element.value;
    selectedCategory = value;

    $.getJSON('/templates/templatesFields',{'docType':value}, function( data ) {
        filterFields = data[0].fields;
        getData(value);
    });

}

function placeNearestLocations(latitude,longitude) {
//    var value = element.value;
//    var keyName = element.id;

    objMarkersFilterQuery['dbToSearchFor'] = 'metadata';// templateCategory;
    if (selectedCategory != "" && selectedCategory != undefined) {
        objMarkersFilterQuery = {"docType":selectedCategory,
            '$and' : [{"Latitude" :{'$gte':latitude}},{"Latitude" :{'$lte':latitude}}]};
    }
    else
    {
        objMarkersFilterQuery = {'$and' : [{"Latitude" :{'$gte':latitude}},{"Latitude" :{'$lte':latitude}}]};
    }


    $.getJSON('/wareHouses/filter',objMarkersFilterQuery, function( data ) {

        placeMarkesrs(data);

    }, function(){
        placeMarkesrs(null);
    });
}

// Fill table with data
function populateWareHouses() {

    // Empty content string
    var tableContent = '';

    map = new google.maps.Map(document.getElementById('mymap'), {
        center: myLatLng,
        zoom: 5
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
    google.maps.event.addListener(map, 'click', function(event) {
        for (i = 0; i < arrUserMarkers.length; i++)
        {
            arrUserMarkers[i].setMap(null);
        }
        arrUserMarkers = [];
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        console.log( latitude + ', ' + longitude );
        var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/009900/");

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng( parseFloat(latitude),  parseFloat(longitude)),
            icon: pinImage,
            map: map
        });
        arrUserMarkers.push(marker);
        objMarkersFilterQuery = {};
        placeNearestLocations(latitude,longitude);
    });

    // jQuery AJAX call for JSON
//    $.getJSON('/wareHouses/wareHouses', function( data ) {
//        wareHouses = data;
//        addInput();
//        // For each item in our JSON, add a table row and cells to the content string
//        placeMarkesrs(data);
//
//    });


};

function filterMarkerData(templateCategory, keyName, element) {
    var value = element.value;

    objMarkersFilterQuery['dbToSearchFor'] = 'metadata';// templateCategory;
    if (value == "" || value == undefined) {
        delete objMarkersFilterQuery[keyName];
    }
    else
    {
        objMarkersFilterQuery[keyName] = value;
    }
    objMarkersFilterQuery['docType'] = templateCategory;
    delete objMarkersFilterQuery['$and'];


    $.getJSON('/wareHouses/filter',objMarkersFilterQuery, function( data ) {

        placeMarkesrs(data);

    }, function(){
        placeMarkesrs(null);
    });
}

function resetMarkers() {
    placeMarkesrs(wareHouses);
}

function showFilters(filterName) {
    $("#filter1").hide();
    $("#salesPerson").hide();

    $("#" + filterName).show();
}


function loadFilterSalesPerson(element) {
    var value = element.value;
    var keyName = element.id;

    objMarkersFilterQuery['dbToSearchFor'] = 'salesPerson';// templateCategory;
    if (value == "" || value == undefined) {
        delete objMarkersFilterQuery[keyName];
    }
    else
    {
        objMarkersFilterQuery[keyName] = value;
    }


    $.getJSON('/wareHouses/filter',objMarkersFilterQuery, function( data ) {

        placeMarkesrs(data);

    }, function(){
        placeMarkesrs(null);
    });
//    var value = element.value;
//    selectedCategory = value;
//
//    $.getJSON('/templates/templatesFields',{'docType':value}, function( data ) {
//        filterFields = data[0].fields;
//        getData(value);
//    });

}