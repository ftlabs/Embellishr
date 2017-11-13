class API {
  
    getResultsByYear(word, year) {
        var urlComponent = encodeURIComponent(word);
        var url = `/embellish/condensed/${year}/${urlComponent}`;
        return fetch(url).then(resp => resp.json())
    }
}