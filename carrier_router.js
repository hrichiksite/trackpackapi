const asendia_usa = require('./carriers/asendia_usa');
const dhl = require('./carriers/dhl');
//const fedex = require('./carriers/fedex');
const fourpx = require('./carriers/fourpx');

async function track_package(trackingId, carrier) {
    //const carrier = carrier.toLowerCase();
    switch (carrier) {
        case 'asendia_usa':
            return await asendia_usa(trackingId);
        case 'dhl':
            return await dhl(trackingId);
        //case 'fedex':
        //    return await fedex(trackingId);
        case '4px':
            return await fourpx(trackingId);
        default:
            throw new Error(`Carrier not supported: ${carrier}`);
    }

}

module.exports = track_package;