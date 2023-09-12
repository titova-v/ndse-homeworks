#!/usr/bin/env node

const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const DEFAULT_LOG_FILENAME = 'log.txt'

const args = yargs(hideBin(process.argv))
    .option('log',
    {
        alias: "l",
        type: "string",
        description: "log file"
    }).argv

const logFileName = args.log || DEFAULT_LOG_FILENAME

function analyze() {
    convertTextToDataArray(dataArray => {
        let countTotal = dataArray.length,
            countWin = 0,
            countFail = 0
        dataArray.forEach(row => {
            if (row.win)
                countWin++
            else
                countFail++
        })

        printStatistic({countTotal, countWin, countFail})
    })
}

function convertTextToDataArray(callback) {
    const data = fs.readFileSync(logFileName, 'utf-8', (err) => {
        if (err) throw Error(err)
    })
    
    let dataArr = `${data
        .replace(/(\r\n\t|\n|\r\t)/gm,'')
        .replace(/}{/g, '},{')}`.split('},')

        dataArr = dataArr.map(el => {
            if (!el.length)
                return
            try {
                return JSON.parse(el+='}')
            }
            catch {
                return
            }

        })

        dataArr = dataArr.filter(el => !!el)

        callback(dataArr)
}

function printStatistic(statistic) {
    const {countTotal, countWin, countFail} = statistic
    const percentWin = Math.round(countWin/countTotal*100)
    console.log(`Total games: ${countTotal}\nWinnings: ${countWin}\nLosses: ${countFail}\nWinnings percentage: ${percentWin}%`)
}

analyze()
