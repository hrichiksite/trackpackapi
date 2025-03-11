const NodeCache = require( "node-cache" );
const DHLCache = new NodeCache({
  deleteOnExpire: true,
  stdTTL: 60 * 60 * 24 // 1 day
  
});

function mapToStandardSchema(apiResponse) {
  const shipment = apiResponse.shipments[0];
  let currentStatus, currentStatusDescription;
  const statusCode = shipment.status.statusCode;

  if (statusCode === "transit") {
    currentStatus = "In Transit";
  } else if (statusCode === "pre-transit") {
    currentStatus = "Pre-Transit";
  } else if (statusCode === "delivered") {
    currentStatus = "Delivered";
  } else {
    currentStatus = "Unknown";
  }

  currentStatusDescription = shipment.status.description || "Unknown";

  const origin = {
    name: shipment.origin.address.countryCode,
    code: shipment.origin.address.countryCode
  };
  const destination = {
    name: shipment.destination.address.countryCode,
    code: shipment.destination.address.countryCode
  };
  const daysInTransit = null; // No direct duration provided in this schema

  const transitEvents = shipment.events.map(event => ({
    description: event.description,
    location: event.location.address.addressLocality || 'Unknown',
    timestamp: new Date(event.timestamp).getTime(),
    latlng: [0, 0] // Replace with actual latitude and longitude if available
  }));

  return {
    echo: {
      trackingID: shipment.id
    },
    data: {
      currentStatus,
      currentStatusDescription,
      origin,
      destination,
      daysInTransit,
      transitEvents
    }
  };
}


async function dhl(trackingId) {
  const cachedData = DHLCache.get(trackingId);
  if(cachedData){
    return mapToStandardSchema(cachedData);
  }

const res = await fetch(`https://api-eu.dhl.com/track/shipments?trackingNumber=${trackingId}&language=en&requesterCountryCode=IN`, {
    "headers": {
      "accept": "application/json",
      "DHL-API-Key":process.env.DHL_API_KEY
    },
    "method": "GET",
  });

  const data = await res.json();

  if(data.status !== 200){
    throw new Error(`DHL API error!`);
  }

  //cache the repsonse
  DHLCache.set(trackingId, data);
  return mapToStandardSchema(data);
}

module.exports = dhl;