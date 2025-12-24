/* eslint-env node */
import { execFile, exec, spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'
import {json} from "express";

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function retrieveData(req, res){
    try{
        //http://localhost:3001/api/test?xAxis=(wtv u want)&alg=(bfs/dfs)&yearStart=()&yearEnd=()
        if(req.query.yearStart > req.query.yearEnd){
            throw new Error("Year end can't be greater than year start")
        }

        const getXAmt = 200 // how many requests we make at a time
        let pageNumber = 1
        // for(let i = 0; i < 10; i++){
            console.log(`trying page ${i}`)
            let chunk = []
            // for(let k = 1; k < 201; k+=getXAmt){


                let requests = [] // we will house all fetch requests in this array
                //
                // for (let j = k; j < k + getXAmt && j < 201; j++) {
                //
                //     requests.push(fetch(process.env.DATA_API +
                //         "?pageNumber=" + pageNumber +
                //         "&pageSize=50" +
                //         "&orderingSpecifier=discard" +
                //         "&app_token=" + process.env.SECRET_TOKEN))
                //     pageNumber++;
                // }

                requests.push(fetch(process.env.DATA_API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Token": process.env.SECRET_TOKEN
                    },
                    body: JSON.stringify({
                        query: `
          SELECT date_extract_y(date_rptd) as year, crm_cd, ${req.query.xAxis}, dr_no, lat, lon 
          COUNT(*) AS count
          WHERE date_extract_y(date_rptd) between ${req.query.yearStart} and ${req.query.yearEnd}
          LIMIT 1000000
        `
                    })
                }));


               //DATA_API and SECRET_TOKEN are hidden in the .env file.
                const response = await Promise.all(requests)

                /*
                we will do 20 requests at a time and await for the 20 to finish
                This is faster than doing one requests at a time because instead of waiting one by one
                we only wait for 20 than do next 20
                we have it set to 20 for now so we dont get blocked by the api
                i personally am to afraid to go higher than that for now
                 */

                const jsonArr = await Promise.all(response.map(r => r.json()))



                //turn all the response into json so we can put them into file


                const filter = jsonArr.flatMap((item) => {
                    if (Array.isArray(item)) {
                        return item.map((d) => {
                            return {
                                [req.query.xAxis]: d[req.query.xAxis],
                                dr_no: d.dr_no,
                                lat: d.lat,
                                lon: d.lon
                            };
                        });
                    } else {
                        return [];
                    }
                });


                /*
                this will filter the data so that we only have certain values. that are requested
                 */


                chunk.push(...filter)
                /*
                this chunk we just aquired after all that will now be inputted into the file so we
                dont write a bajillion lines at once
                 */
                // }
            fs.writeFileSync(`crimeData_${i}.json`, JSON.stringify(chunk))
            console.log("input crimeData: ", i)
        // }

        console.log("saved dataset.json");
        const result = retrieveXAxisData(req.query.xAxis)
        res.status(200).json({xAxisVals: result[0], yAxisMax: result[1], tree: await runCpp(req.query.alg)})
    } catch(error){
        console.error("Couldnt get crime data", error)
        res.status(400).json({msg: "failed to retrieve data"})
    }
}


export async function retrieveDataGraph(req, res){
    try{
        //http://localhost:3001/api/test?xAxis=(wtv u want)&&yearStart=()&yearEnd=()
        if(req.query.yearStart > req.query.yearEnd){
            throw new Error("Year end can't be greater than year start")
        }


        let requests = []

        requests.push(fetch(process.env.DATA_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": process.env.SECRET_TOKEN
            },
            body: JSON.stringify({
                query: `
          SELECT ${req.query.xAxis},
          COUNT(*) AS count
          WHERE date_extract_y(date_rptd) between ${req.query.yearStart} and ${req.query.yearEnd}
          GROUP BY ${req.query.xAxis}
          ORDER BY ${req.query.xAxis}
        `
            })
        }));


        //DATA_API and SECRET_TOKEN are hidden in the .env file.
        const response = await Promise.all(requests)

        const jsonArr = await Promise.all(response.map(r => r.json()))

        const aggregatedGraph = {}

        for(const item of jsonArr){
            if(!Array.isArray(item)) continue

            for(const d of item){
                const key = d[req.query.xAxis]
                if(key == null) continue

                aggregatedGraph[key] = (aggregatedGraph[key] || 0) + d.count
            }
        }



        const rg = Object.entries(aggregatedGraph).map(([key, count]) => ({
            xAxisVals: isNaN(key) ? key : Number(key),
            count
        }))


        let highest = 0;

        const resultGraph = rg.reduce((acc, {xAxisVals, count}) =>{
            acc.xAxisVals.push(xAxisVals)
            acc.counts.push(Number(count))
            highest = Math.max(Number(count), highest)
            return acc
        },
            {xAxisVals: [], counts: []}
        )
        console.log(resultGraph)
        res.status(200).json({resultGraph, maxYval: highest})

    } catch(error){
        console.error("Couldnt get crime data", error)
        res.status(400).json({msg: "failed to retrieve data"})
    }
}

export async function retrieveDataMap(req,res) {
    try {
        if(req.query.yearStart > req.query.yearEnd){
            throw new Error("Year end can't be greater than year start")
        }

        let requests = fetch(process.env.DATA_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": process.env.SECRET_TOKEN
            },
            body: JSON.stringify({
                query: `
          SELECT lat, lon
          WHERE lat IS NOT NULL AND lon IS NOT NULL AND date_extract_y(date_rptd) BETWEEN ${req.query.yearStart} AND ${req.query.yearEnd}
        `
            })
        });

        let response = await requests


        let jsRes = await response.json()

        let hold = []

        for(const item of jsRes){
            hold.push({
                lat: Number(item.lat),
                lon: Number(item.lon)
            })
        }

        res.status(200).json(hold)

    } catch (error) {
        console.error("Couldnt get geographical data", error)
        res.status(400).json({msg: "failed to retrieve geographical data"})

    }
}


export function runCpp(alg){
        let res = ''
        const filesToCompile = "tree.cpp crime.cpp"
        const exeName = process.platform == "win32" ? "P2-DSA_LACrimeData.exe" : "P2-DSA-LACrimeData"
        const exeLoc = path.join(__dirname, "cpp", "build", exeName)
        const fileLoc = path.join(__dirname, "cpp")

        exec(`g++ -std=c++17 ${filesToCompile} -o ${exeLoc}`, {cwd: fileLoc}, (error, stdout, stderr) =>{
            if(error) {
                console.log("failed to compile ", exeName, error.message)
                return "Failed to compile";
            }

            console.log(`Compiled ${exeName}!`)
        })

        const binPath = path.join(__dirname, "cpp", "build", exeName); //Executable path
        if (!fs.existsSync(binPath)) {
            throw new Error("Cant find exe at ", binPath)
        }
        const args = [alg];
    return new Promise((resolve, reject) => {
        const cppProc = spawn(binPath, args, {
            cwd: path.join(__dirname, "cpp", "build")
        });


        cppProc.stdout.on("data", (data) => {
            // process.stdout.write(data)
            const text = data.toString()
            res += (text)
        })

        // cppProc.stderr.on("data", (data) => {
        //     console.error("C++ stderr:", data.toString());
        //     return "Error " + data.toString();
        // });

        cppProc.on("close", (code) => {
            console.log(`C++ process exited with code ${code}`);
            resolve(res)
        });

        cppProc.on('error', reject)

        // const result = [...res]

    })
}


//just for testing retrieveData. run by going to localhost:PORT/test. same as other just only does one .json file with less data
export async function retrieveDataTest(req, res){
    try{

        const get20 = 20
        let pageNumber = 1
        // for(let i = 0; i < 1; i++){
            console.log(`trying page 0`)
            let chunk = []
            for(let k = 1; k < 21; k+=get20){

                let requests = []

                // for (let j = k; j < k + get20 && j < 101; j++) {
                //     requests.push(fetch(process.env.DATA_API +
                //         // "?pageNumber=" + pageNumber +
                //         // "&pageSize=20" +
                //         // "&orderingSpecifier=discard" +
                //         "?app_token=" + process.env.SECRET_TOKEN +
                //         "&limit=1"
                //         // "&$select=date_extract_y(date) as year" +
                //         // "&$where=date_extract_y(date)=2021" +
                //         // "&$group=year"
                //     ))
                    // pageNumber++;
                // }

        requests.push(fetch(process.env.DATA_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": process.env.SECRET_TOKEN
            },
            body: JSON.stringify({
                query: `
          SELECT date_extract_y(date_rptd) as year, crm_cd, ${req.query.xAxis}, dr_no, lat, lon 
          WHERE date_extract_y(date_rptd) between ${req.query.yearStart} and ${req.query.yearEnd}
          LIMIT 100000
        `
            })
        }));
                // }

                const response = await Promise.all(requests)


                const jsonArr = await Promise.all(response.map(r => r.json()))





                const filter = jsonArr.flatMap(item =>
                    Array.isArray(item) ?
                        item.map(d => ({
                            [req.query.xAxis]: d[req.query.xAxis],
                            dr_no: d.dr_no,
                            lat: d.lat,
                            lon: d.lon
                        }))
                        : [])



                chunk.push(filter)

            }
            fs.writeFileSync(`crimeData_0.json`, JSON.stringify(chunk))
            console.log("input crimeData: ", 0)
        // }

        console.log("saved dataset.json");
        res.status(200).json({msg: JSON.stringify(chunk)})
    } catch(error){
        console.error("Couldnt get crime data", error)
        res.status(400).json({msg: "failed to retrieve data"})
    }
}
export function retrieveXAxisData(xAxisReq){
    try{
        const xAxis =  xAxisReq;
        const allData = [];
        //read
        for (let i = 0; i < 10; i++) {
            try {
                const chunk = JSON.parse(fs.readFileSync(`crimeData_${i}.json`));
                allData.push(...chunk);
            } catch (err) {
                console.error(`Error reading file crimeData_${i}.json:`, err);
            }
        }
        //Grouped by x axis
        const grouped = {};
        allData.forEach(item => {
            const key = item[xAxis] || "UNKNOWN";
            if (grouped[key]) { //count the frequencies
                grouped[key]++;
            } else {
                grouped[key] = 1;
            }
        });

        const maxYVal = Math.max(...Object.values(grouped))
        const yVals = Object.values(grouped);
        const lisXVals = [[...Object.keys(grouped)], maxYVal]

        console.log("grouped data ready");
        return lisXVals
    } catch (error) {
        console.error("Error processing data:", error);
    }
}