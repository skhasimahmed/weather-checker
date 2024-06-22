import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import {
    GeoapifyGeocoderAutocomplete,
    GeoapifyContext
} from '@geoapify/react-geocoder-autocomplete';


const AutoCompleteCity = () => {
    return (
        <>
            <GeoapifyContext apiKey="be824bf1abe34692ba250508359e8b9e">
                <GeoapifyGeocoderAutocomplete
                    placeholder="Enter city name"
                />
            </GeoapifyContext>
        </>
    )
}

export default AutoCompleteCity
