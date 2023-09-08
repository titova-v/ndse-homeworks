#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const date = new Date()
let operationSign = 1

const argumnetsArray = hideBin(process.argv)
yargs(argumnetsArray)
    .option('year',
    {
        alias: "y",
        type: "boolean",
        description: "current year"
    })
    .option('month',
    {
        alias: "m",
        type: "boolean",
        description: "current month"
    })
    .option('date',
    {
        alias: "d",
        type: "boolean",
        description: "current day in month"
    })
    .command('current', 'get current date', () => {}, checkArgs)
    .argv

yargs(argumnetsArray)
    .option('year',
    {
        alias: "y",
        type: "number",
        description: "year"
    })
    .option('month',
    {
        alias: "m",
        type: "number",
        description: "month"
    })
    .option('date',
    {
        alias: "d",
        type: "number",
        description: "day"
    })
    .command('add', 'get date in future', () => {}, calculateDate)
    .command('sub', 'get date in past', () => { operationSign = -1}, calculateDate)
    .argv

    
function checkArgs(args) {
    if (args.year)
        console.log(date.getFullYear())
    else if (args.month)
        console.log(date.getMonth() + 1)
    else if (args.date)
        console.log(date.getDate())
    else
        console.log(date)
}

function calculateDate(args) {
    if (args.year)
        date.setFullYear(date.getFullYear() + operationSign*args.year)
    else if (args.month)
        date.setMonth(date.getMonth() + operationSign*args.month)
    else if (args.date)
        date.setDate(date.getDate() + operationSign*args.date)
    
    console.log(date.toISOString())
}

