const http = require('http')
const readline = require('node:readline');
const {
    stdin: input,
    stdout: output,
} = require('node:process');
const rl = readline.createInterface({ input, output });

const myAPIKey = process.env.myAPIKey

function getWeatherData(city) {
    if (!city.trim()) {
        askCity()
        return
    }

    if (city.trim() == 'q') {
        rl.close()
        return
    }

    const url = `http://api.weatherstack.com/current?access_key=${myAPIKey}&query=${city}`

    http.get(url, response => {
        const {statusCode} = response
    
        if (statusCode !== 200) {
            console.log(`statusCode: ${statusCode}`)
            return
        }
        
        response.setEncoding('utf8')
    
        let rowData = ''
    
        response.on('data', chunk => {
            rowData += chunk
        })
    
        response.on('end', () => {
            let parseData = JSON.parse(rowData)
            console.log(parseData)

            askCity();
        })
    }).on('error', err => {
        console.error(`err\n`)
    })
}

function askCity() {
    rl.question(`Input city. Print "q" to quit app.\n`, getWeatherData);
}

askCity()