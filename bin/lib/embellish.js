const fetchContent = require('./fetchContent');
const directly = require('./directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;

//Create a word - number mapping of the months
const monthMap = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ]
.reduce((result, item, index) => {
    result[index+1] = item;
    return result;
  }, {});

/**
 * Returns a dictionary of data for each month.
 * @param {*} word 
 * @param {*} year 
 */ 
function lookupWordByYear(word, year, params={}) {
    let yearResponse = {};
    return _fetchYear(word, year, params).then( searchResponses => {
        for(let response of searchResponses) {
            let month = new Date(response.params.month).getMonth() + 1;
            yearResponse[monthMap[month]] = response.sapiObj.results;
        }
        return yearResponse
    });
}

/**
 * Create concurrent fetches for each month (uses directly)
 */
function _fetchYear(word, year, params={}) {
    const wordLookupPromisers = []    
    for(let i = 1; i <= 12; i++) {
        wordLookupPromisers.push(() => lookupWordByMonth(word, year, i, params));
    }
    return directly(CAPI_CONCURRENCE, wordLookupPromisers)
}

/**
 * Returns a summary of the year
 * @param {*} word 
 * @param {*} year 
 */
function yearSummary(word, year) {
    let yearResponse = {
        months: {},
        total: null
    };
    return _fetchYear(word, year).then(searchResponses => {
        let total = 0;
        for(let response of searchResponses) {
            let month = new Date(response.params.month).getMonth() + 1;
            let monthString = [monthMap[month]];
            let summary = _createSummary(response)
            yearResponse.months[monthString] = summary;
            total+= summary.count;            
        }
        yearResponse.total = total;
        return yearResponse
    });
}

function condensedSummary(word, year) {
    let summaryResponse = {
        months: [],
        people: {}
    }
    return _fetchYear(word, year).then(responses => {
        for(let response of responses) {
            let indexCount = null;
            let facets = null;
            if(response.hasOwnProperty('sapiObj')) {
                indexCount = response.sapiObj.results[0].indexCount;
                facets = response.sapiObj.results[0].facets;
            }
            summaryResponse.months.push(indexCount);              
            if(facets) {
                let people = facets.filter(obj => obj.name === 'people').pop() 
                for(let person of people.facetElements) {
                    if(!(person.name in summaryResponse.people)) {
                        summaryResponse.people[person.name] = new Array(12).fill(0);
                    }
                    let month = new Date(response.params.month).getMonth();
                    if(person.count != null)
                    summaryResponse.people[person.name][month] = person.count;
                }  
            }
        }
        return summaryResponse;
    })
}

/**
 * Create a summary of each month, extracting key information
 * @param {*} response 
 * @param {*} peopleSize 
 */
function _createSummary(response, peopleSize = 10) {
    const summary = {}
    let results = response.sapiObj.results.pop();
    let count = results.indexCount;
    let articles = results.results;
    summary.count = count;
    let people = [];
    if(results.hasOwnProperty('facets') && (results.facets.length != 0)) {
        people = results.facets.pop().facetElements;;
    }
    summary.people = people.length > peopleSize ? people.slice(0,peopleSize) : people;
    summary.articles = articles.map((article) => article.title.title);
    return summary;
}
/**
 * Looksup a word by month
 * @param {*} word - Word to be searched
 * @param {*} year - Year to be searched
 * @param {*} month - Month (Number format)
 * @private
 */
function lookupWordByMonth(word, year, month, queryParams={}) {
    if(month > 12 || month < 1) {
        throw new Error("Month must be given in a format between 01 - 12")
    }
    let beforeTime = new Date(year, month, 01).toISOString().replace('.000Z', 'Z');   
    let afterTime = new Date(year, month, 01);
    afterTime.setMonth(afterTime.getMonth() - 1);
    afterTime = afterTime.toISOString().replace('.000Z', 'Z'); 
    return fetchContent.searchWordBetweenRange(word, afterTime, beforeTime)
        .catch(err => {
            console.log(`Error: lookupWordByMonth failed to return for ${beforeTime} - ${afterTime}`);
            return;
    })
}

module.exports = {
    condensedSummary,
    lookupWordByYear,
    lookupWordByMonth,
    yearSummary
}
