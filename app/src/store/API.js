const BASE_URL = "/api";

export default class API {

    getYearResults(word, year) {
        if(year.length > 4) {
            return alert("Please enter a valid year.")
        }
        let urlComponent = encodeURIComponent(word);
        let url = `${BASE_URL}/condensed/${year}/${urlComponent}`;
        return fetch(url).then(resp => resp.json())
    }

}