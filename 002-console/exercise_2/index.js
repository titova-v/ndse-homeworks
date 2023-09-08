#!/usr/bin/env node

const readline = require('node:readline');
const {
    stdin: input,
    stdout: output,
} = require('node:process');
const rl = readline.createInterface({ input, output });

const MAX_NUM = 100;
const RANDOM_NUM = getRandomInt(MAX_NUM);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function checkNum(inputNum) {
    if (isNaN(Number(inputNum)) || isNaN(parseInt(inputNum))) {
        rl.question(`Неверный формат ввода. Введите число\n`, checkNum);
    } else if (inputNum == RANDOM_NUM) {
        console.log(`Отгадано число ${RANDOM_NUM}`);
        rl.close();
    }
    else if (inputNum > RANDOM_NUM){
        rl.question(`Меньше\n`, checkNum);
    }
    else if (inputNum < RANDOM_NUM) {
        rl.question(`Больше\n`, checkNum);
    }
}

rl.question(`Загадано число от 0 до ${MAX_NUM}\n`, checkNum);