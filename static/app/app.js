const monthsCtx = document.getElementById("resultsChart").getContext('2d');
const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
"Sep", "Oct", "Nov", "Dec"]
const api = new API;

function renderChart() {
    var word = document.getElementById('searchWord').value;
    var year = document.getElementById('searchYear').value;
    if(year.length > 4) {
        return alert("Please enter a valid year.")
    }
    api.getResultsByYear(word, year).then(response => {
        var months = response[year].months;  
        people = response[year].people; 
        createChart(word, year, months)
    })
}

function createChart(word, year, months) {
    const resultChart = new Chart(monthsCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Mentions of "${word}" over ${year}`,
                data: months,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        }
    });
}
