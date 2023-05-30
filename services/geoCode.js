const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN

const geoCode = async(address) => {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true`;

    try{
        const response = await fetch(endpoint)
        const data = await response.json()
        const coordinates = data.features[0].center
        if(!coordinates) {
            throw new Error('Could not get coordinates for this location')
        }
        return coordinates
    } catch(error) {
        throw error
    }
}

module.exports = geoCode
