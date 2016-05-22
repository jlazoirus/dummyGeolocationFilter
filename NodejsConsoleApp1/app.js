var earthRadius = 6371,
    minDistance = 100,
    clients = [],
    path = "./clientLocationList.json",
    intercomLocation = {
        latitude: 53.3381985,
        longitude: -6.2592576
    };
/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}
/** Get JSON data from .json file base in the path of the file location */
function getData(dataPath) {
    if (typeof dataPath == "string") {
        try {
            var clients = require(dataPath);
        }
        catch (err) {
            return err;
        }
        if (typeof clients == 'object') { 
            return clients;
        } else {
            error.message = "invalid json data";
        }
    } else {
        error.message = "invalid json data path";
        return error
    }
};
/** Get get distance from two different points */
function getDistance(endPoint, startPoint) {
    try {
        var dLat = (endPoint.latitude - startPoint.latitude) * Math.PI / 180;
        var dLon = (endPoint.longitude - startPoint.longitude) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(startPoint.latitude * Math.PI / 180) * Math.cos(endPoint.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (Math.round(earthRadius * c * 100) / 100);
    }
    catch(err) {
        return err;
    }
};
/** Filters a list of clients in base of a min distance and returns a new list*/
function filterList(clientList, minimumDistance) {
    var newList = [];
    clientList.forEach(function (item) {
        item.distance = getDistance(item, intercomLocation);
        if (item.distance.message) {
            return item.distance.message;
        } else if (item.distance <= 100) {
            newList.push(item);
        }
    });
    return newList;
};
clients = getData(path);
if (clients.message) {
    console.log(clients.message);
} else {
    clients = filterList(clients, minDistance);
    console.log(clients);
}
