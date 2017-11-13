class API {

    constructor() {
    }

    getResultsByYear(word, year) {
        var urlComponent = encodeURIComponent(word);
        var url = `/api/condensed/${year}/${urlComponent}`;
        return fetch(url,{
            credentials: 'include'
        }).then(resp => resp.json())
    }
}