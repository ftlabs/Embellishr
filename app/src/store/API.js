const BASE_URL = "/api";

export default class API {

    getYearResults(word, year) {
        let urlComponent = encodeURIComponent(word);
        let url = `${BASE_URL}/condensed/${year}/${urlComponent}`;
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }
    
    getRelativeYearResults(word) {
        let urlComponent = encodeURIComponent(word);
        let url = `${BASE_URL}/condensed/${urlComponent}`;
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

    getRecentSearchTerms(number) {
        let url = `${BASE_URL}/topSearchTerms/${number}`
        return fetch(url, {
            credentials: 'include'
        }).then(resp => resp.json())
    }

} 