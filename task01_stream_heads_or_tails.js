#!/usr/bin/env node

const yargs = require('yargs/yargs')        
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv))       // Задаем аргументы
    .option('filename', {
        alias: "f",
        type: "string",
        description: "Имя файла для логирования результатов каждой партии" 
    })   
    .argv

if (process.argv.slice(2).length != 2
    || ( process.argv.slice(2)[0] != '-f' && process.argv.slice(2)[0] != '--filename' ) ){

    console.log("Некорректный запуск команды hot. Запустите hot --help")
    return
}

let readline = require('node:readline');
let terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let suc = 0
let fail = 0
let mode = "Game"
let success_answer = 0

let fs = require("fs")
let path = require("path")
let filename = process.argv.slice(2)[1]
let logfile = path.join(__dirname,filename)

dt = new Date().toLocaleString()
// Дописываем в конец файла
fs.appendFile(logfile,`Новая партия ${dt} \n`, (err) =>{
    if (err) throw Error(err)
    new_game()
})

function main_cycle(){

    terminal.on('line', function(answer)
    {
        // Обработка текущего режима работы игры
        switch (mode){
            case "Game": 
                var current_answer = parseInt(answer);
                if (!current_answer){
                    mode = "AskExit"                 
                    terminal.setPrompt(`Хотите закончить игру (y/n)? `);
                    break
                }
        
                switch (success_answer) {
                    case 1:
                        answer_text = '"орел"'
                        break;
                    case 2:
                        answer_text = '"решка"'
                        break;            
                }

                if (current_answer === success_answer)
                {
                    console.log(`Вы угудали! Это ${answer_text}`);
                    suc++;
                }
                else{
                    console.log(`К сожалению, Вы не угудали! Это ${answer_text}`);
                    fail++;
                }

                mode = "AskContinue"
                terminal.setPrompt(`Хотите сыграть еще (y/n)? `);

                break

            case "AskContinue":           
                switch (answer){
                    case "y":
                        mode = "Game"
                        terminal.setPrompt(`Орел или решка (введите 1 или 2)? \n`)

                        success_answer = getRandomInt(1) + 1
                        break  

                    default:
                        mode = ""
                        console.log(`Игра закончена!`);
                        console.log(`Сыграно ${suc + fail}, выиграно ${suc}, проиграно ${fail}`);
                        // Дописываем в конец файла
                        //fs.appendFileSync(logfile,`Сыграно ${suc + fail}, выиграно ${suc}, проиграно ${fail} \n`)
                        fs.appendFile(logfile,`Сыграно ${suc + fail}, выиграно ${suc}, проиграно ${fail} \n`, (err) =>{
                            if (err) throw Error(err)
                            main_cycle()
                            process.exit(0);
                        })                        
                        break                     
                }
                break
            case "AskExit":            
                switch (answer){
                    case "y":
                        mode = ""
                        console.log(`Игра закончена!`);                    
                        console.log(`Сыграно ${suc + fail}, выиграно ${suc}, проиграно ${fail}`);
                        // Дописываем в конец файла
                        fs.appendFile(logfile,`Сыграно ${suc + fail}, выиграно ${suc}, проиграно ${fail} \n`, (err) =>{
                            if (err) throw Error(err)
                            main_cycle()
                            process.exit(0); 
                        })                                           
                        break 

                    default:
                        mode = "Game"
                        terminal.setPrompt(`Орел или решка (введите 1 или 2)? \n`)

                        success_answer = getRandomInt(1) + 1       
                        break                       
                }
                break
        }

        if (mode != "")
            terminal.prompt();
    });    
}

function new_game(){
    
    // Программа загадывает 1 или 2. Будем считать 1 - "орел", 2 - "решка"
    success_answer = getRandomInt(1) + 1

    // Начинаем играть с режима Game
    mode = "Game"
    terminal.setPrompt(`Орел или решка (введите 1 или 2)? \n`)
    terminal.prompt();

    main_cycle()
}