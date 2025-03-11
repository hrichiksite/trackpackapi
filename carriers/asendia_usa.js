function mapToStandardSchema(trackingData) {
  return {
      destination: {
          country: trackingData.trackingBrandedSummary.destinationCountry,
          countryIso2: trackingData.trackingBrandedSummary.destinationCountryIso2
      },
      trackingNumbers: {
          vendor: trackingData.trackingBrandedSummary.trackingNumberVendor,
          customer: trackingData.trackingBrandedSummary.trackingNumberCustomer,
          originalCarrier: trackingData.trackingBrandedSummary.trackingNumberCustomerCarrierOriginal
      },
      service: trackingData.trackingBrandedSummary.service,
      weight: trackingData.trackingBrandedSummary.weight,
      trackingProgress: trackingData.trackingBrandedSummary.trackingProgress,
      finalMileTrackingLink: trackingData.trackingBrandedSummary.finalMileTrackingLink,
      events: trackingData.trackingBrandedDetail.map(event => ({
          code: event.eventCode,
          description: event.eventDescription,
          location: {
              address: event.eventLocationDetails.addressLine1 || null,
              city: event.eventLocationDetails.city || null,
              province: event.eventLocationDetails.province || null,
              postalCode: event.eventLocationDetails.postalCode || null,
              countryIso2: event.eventLocationDetails.countryIso2 || null,
              countryName: event.eventLocationDetails.countryName || null
          },
          timestamp: event.eventOn,
          source: event.eventSource
      }))
  };
}


async function asendia_usa(trackingId) {
    const url = `https://a1reportapi.asendiaprod.com/api/A1/TrackingBranded/Tracking?trackingKey=AE654169-0B14-45F9-8498-A8E464E13D26&trackingNumber=${trackingId}`;

    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'accept-language': 'en-IN,en;q=0.9',
        'authorization': 'Basic Q3VzdEJyYW5kLlRyYWNraW5nQGFzZW5kaWEuY29tOjJ3cmZzelk4cXBBQW5UVkI=',
        'content-type': 'application/json',
        'x-asendiaone-apikey': '32337AB0-45DD-44A2-8601-547439EF9B55'
      }
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.responseStatus.responseStatusCode !== 200) {
      throw new Error(`Asendia API error!`);
    }

    return mapToStandardSchema(data);
}

module.exports = asendia_usa;