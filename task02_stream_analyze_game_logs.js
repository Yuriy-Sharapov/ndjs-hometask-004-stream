#!/usr/bin/env node

const yargs = require('yargs/yargs')        
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv))       // Задаем аргументы
    .option('filename', {
        alias: "f",
        type: "string",
        description: "Путь к файлу логов из задания 1" 
    })   
    .argv

if (process.argv.slice(2).length != 2
    || ( process.argv.slice(2)[0] != '-f' && process.argv.slice(2)[0] != '--filename' ) ){

    console.log("Некорректный запуск команды agl. Запустите agl --help")
    return
}

let fs = require('fs')
let filename = process.argv.slice(2)[1]
let readerStream = fs.createReadStream(filename)

// 1. общее количество партий,
let sets = 0
let games = 0
// 2. количество выигранных/проигранных партий,
let suc = 0
let fail = 0
// 3. процентное соотношение выигранных партий.
let proc = 0

readerStream
    .setEncoding('UTF8')
    .on('data', (chunk) => { // подписываемся на события порционного чтения данных
        count_props(chunk)
    })
    .on('end', () => {        // подписываемся на событие окончания чтения данных
        // определеняем общее количество игр, как сумму выигранных и проигранных
        games = suc + fail
        // определяем процент успеха
        if (games != 0) proc = suc * 100 / games
        else proc = 0

        console.log(`Сыграно всего партий ${sets}`)
        console.log(`Сыграно всего игр ${games}`)   
        console.log(`Выиграно всего игр ${suc}, проиграно всего игр ${fail}`)
        console.log(`Успех ${proc}%`)
    })

function count_props(chunk){

    // считаем количество партий
    myArray = chunk.match(/партия/g)
    sets += myArray.length

    // считаем количество выигранных игр
    myArray =chunk.match(/(?<=(выиграно ))\d+/g)
    myArray.forEach(element => {
        suc += Number(element)
    });

    // считаем количество проигранных игр
    myArray =chunk.match(/(?<=(проиграно ))\d+/g)
    myArray.forEach(element => {
        fail += Number(element)
    });

}