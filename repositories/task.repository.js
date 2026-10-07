const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path")

let data = [];
const filePath = path.join(".", "task.json");


async function loadData() {
    const jsonData = await fsPromises.readFile(filePath, "utf-8");
    data = JSON.parse(jsonData);
}

function loadDataSync() {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    data = JSON.parse(jsonData);
}

function getTasks() {
    return data.tasks;
}

async function saveTasks(fileData) {
    await fsPromises.writeFile(
        filePath,
        JSON.stringify({ tasks: fileData }, null, 2)
    );
}

module.exports = {
    loadData,
    loadDataSync,
    getTasks,
    saveTasks
};