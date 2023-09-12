#!/usr/bin/env node

const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const readline = require('node:readline');
const {
    stdin: input,
    stdout: output,
} = require('node:process');

const DEFAULT_LOG_FILENAME = 'log.txt'

const args = yargs(hideBin(process.argv))
    .option('log',
    {
        alias: "l",
        type: "string",
        description: "log file"
    }).argv

const rl = readline.createInterface({ input, output });

const logFileName = args.log || DEFAULT_LOG_FILENAME

let randomNumber

function getRandomNumber() {
    return Math.floor(Math.random()*2) + 1
}

function checkPlayerAnswer(answer) {
    const result = Number(answer) == randomNumber
    if (result) {
        console.log(`Right! :)\n`)
    } else {
        console.log(`Wrong! :(\n`)
    }

    fs.appendFile(logFileName, `{ "guessed": ${randomNumber}, "answer": ${answer}, "win": ${result} },\n`,
    err => {
        if (err)
            closeAll
        else
            askContinueGame()
    })
}

function askContinueGame() {
    rl.question(`Do you want continue? y/n\n`, answer => {
        answer = answer.trim().toLowerCase()
        if (['y', 'yes', ''].includes(answer)) {
            startGame()
        } else {
            closeAll()
        }

    });
}

function closeAll(err) {
    rl.close()
    
    err && console.error(err)
}

function startGame() {
    randomNumber = getRandomNumber()
    rl.question(`Let's play! Heads (1) or tails (2)? Write the number 1 or 2.\n`, checkPlayerAnswer);
}

startGame()