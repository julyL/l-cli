const fs = require('fs');
const path = require('path');
const https = require('https');
const glob = require('glob');
const pLimit = require('p-limit');
const limit = pLimit(2);

function logError(message) {
    console.error(message);
}

function scanCode(input, output) {

}

async function removeUnuseImage({
    pattern = '**/*.{jpg,jpeg,png}'
}) {
    let fileList = glob.sync(pattern, {
        ignore: '**/node_modules/**'
    });
    let proList = [];
    fileList.forEach((file) => {
        let d = path.parse(file);
        console.log(file);
    });
    try {
        await Promise.all(proList);
    } catch (error) {
        console.log(error);
    }
};
module.exports = removeUnuseImage;