import {spawn} from "child_process"
import { log } from "console";
import fs, { writeFile } from "fs"
import { createWriteStream } from "fs";




function processStatistics ( command, args, timeout) {

    const childProcess = spawn(command, args, {
        stdio: ["pipe", "pipe", "pipe"]
    })
    const obj = {
        start: "",
        duration: 0,
        success: false,
    }

    childProcess.stdout.on("data", (data) => {

        let date = new Date().getTime()
        let time = new Date(date+14400000)
        let time_and_command = time.toUTCString() +" "+ command
        let fileName = time_and_command.replaceAll(":", ".")

        obj.start = time.toUTCString()
        obj.success = true
        delete obj.commandSuccess
        obj.duration = process.uptime()*1000
        const myJSON = JSON.stringify(obj)


        const writableStream = createWriteStream(`logs/${fileName}.json`)
        writableStream.write(myJSON)

    })
    childProcess.on("error",(error) =>{
        let date = new Date().getTime()
        let time = new Date(date+14400000)
        let time_and_command = time.toUTCString() +" "+ command
        let fileName = time_and_command.replaceAll(":", ".")

        const writableErrStream = createWriteStream(`logs/${fileName}.json`)

        obj.commandSuccess = false
        obj.error = error.message
        const myJSON = JSON.stringify(obj)
        writableErrStream.write(myJSON)
    })


}

processStatistics("node", ["-v"])