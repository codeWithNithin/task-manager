const fs = require("fs");
const fsPromises = require("fs/promises");

let data = [];

async function loadData() {
    const jsonData = await fsPromises.readFile("./task.json", "utf-8");
    data = JSON.parse(jsonData);
}

function loadDataSync() {
    const jsonData = fs.readFileSync("./task.json", "utf-8");
    data = JSON.parse(jsonData);
}

function getTasks() {
    return data.tasks;
}

async function saveTasks(fileData) {
    await fsPromises.writeFile(
        "./task.json",
        JSON.stringify({ tasks: fileData }, null, 2)
    );
}

module.exports = {
    loadData,
    loadDataSync,
    getTasks,
    saveTasks
};