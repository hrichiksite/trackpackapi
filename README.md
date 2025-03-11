# Universal Shipment Tracking API

## Overview
This API queries multiple carriers and returns tracking data in a unified format.

## Base URL
```
https://packtrack.burger.xyz
```

## Endpoints

### Root Endpoint
#### `GET /`
Returns a welcome message describing the API.

**Response:**
- `200 OK`: Plain text message

### Track a Package
#### `POST /track/{trackingNumber}`
Tracks a package with a specified carrier.

**Path Parameters:**
- `trackingNumber` (string, required): The tracking number of the package.

**Request Body:**
```json
{
  "carrier": "dhl"
}
```

**Responses:**
- `200 OK`: Returns tracking information (See [TrackingResponse](#trackingresponse))
- `400 Bad Request`: Invalid request
- `500 Internal Server Error`: Tracking error

### Auto-detect Carrier and Track
#### `GET /track/auto/{trackingNumber}`
Attempts to determine the carrier from the tracking number and fetch tracking details.

**Path Parameters:**
- `trackingNumber` (string, required): The tracking number of the package.

**Responses:**
- `200 OK`: Returns tracking information (See [TrackingResponse](#trackingresponse))
- `400 Bad Request`: Cannot determine carrier from tracking number
- `500 Internal Server Error`: Tracking error

### List Supported Carriers
#### `GET /carriers`
Returns a list of supported carriers.

**Response:**
```json
{
  "carriers": ["asendia_usa", "4px", "dhl"]
}
```

## Data Models
### TrackingResponse
```json
{
  "tracking_number": "123456789",
  "carrier": "Carrier Name",
  "status": "In Transit",
  "status_code": "IN_TRANSIT",
  "estimated_delivery": "2025-03-15T10:00:00Z",
  "origin": {
    "location": "New York, NY, USA",
    "timestamp": "2025-03-10T08:30:00Z"
  },
  "destination": {
    "location": "Los Angeles, CA, USA"
  },
  "current_location": {
    "location": "Chicago, IL, USA",
    "timestamp": "2025-03-11T12:45:00Z"
  },
  "history": [
    {
      "status": "Picked Up",
      "status_code": "PICKED_UP",
      "location": "New York, NY, USA",
      "timestamp": "2025-03-10T08:30:00Z"
    },
    {
      "status": "In Transit",
      "status_code": "IN_TRANSIT",
      "location": "Chicago, IL, USA",
      "timestamp": "2025-03-11T12:45:00Z"
    }
  ]
}