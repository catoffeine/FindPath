'use strict';
let table = document.querySelector(".field");
let beginBtn = document.querySelector(".beginBtn");
let isBeginBtn = false;
let beginCount = 0;
let beginInd;

let exitBtn = document.querySelector(".exitBtn");
let isExitBtn = false;
let exitCount = 0;
let exitInd;

let start = document.querySelector(".find");
let refresh = document.querySelector(".refresh");

let weights = [];
let queue = [];

let isReal = false;

console.log(table.length);
for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[0].cells.length; j++) {
        table.rows[i].cells[j].classList.add("empty"); 
        weights.push(999);
    }
}

refresh.onclick = function() {

    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[0].cells.length; j++) {
            if (table.rows[i].cells[j].classList.contains("begin")) {
                table.rows[i].cells[j].classList.remove("begin"); 
                isBeginBtn = false;
                if (beginBtn.classList.contains("begin")) {
                    beginBtn.classList.remove("begin");
                } else {
                    beginBtn.classList.add("begin");
                }
            } 
            if (table.rows[i].cells[j].classList.contains("exit")) {
                table.rows[i].cells[j].classList.remove("exit");
                isExitBtn = false;
                if (exitBtn.classList.contains("exit")) {
                    exitBtn.classList.remove("exit");
                } else {
                    exitBtn.classList.add("exit");
                }
            } 
            if (table.rows[i].cells[j].classList.contains("wall")) {
                table.rows[i].cells[j].classList.remove("wall"); 
            } 
            if (table.rows[i].cells[j].classList.contains("path")) {
                table.rows[i].cells[j].classList.remove("path");
            } 
            if (table.rows[i].cells[j].classList.contains("emptyPass")) {
                table.rows[i].cells[j].classList.remove("emptyPass");
            }
            table.rows[i].cells[j].classList.add("empty"); 
            weights.shift();
            weights.push(999);
        }
    }
    beginCount = 0;
    exitCount = 0;
    isReal = false;    
}

beginBtn.onclick = function() {
    if (isBeginBtn) {return};
    if (beginBtn.classList.contains("begin")) {
        beginBtn.classList.remove("begin");
    } else {
        beginBtn.classList.add("begin");
    }
   
    isBeginBtn = true;
}

exitBtn.onclick = function() {
    if (isExitBtn) {return};
    if (exitBtn.classList.contains("begin")) {
        exitBtn.classList.remove("exit");
    } else {
        exitBtn.classList.add("exit");
    }
    isExitBtn = true;
}

table.onclick = function(e) {
    let target = e.target;
    if (beginCount == 0 && isBeginBtn && target.classList.contains("empty")) {
        target.classList.remove("empty");
        target.classList.add("begin");
        beginCount++;
        return;
    } else if (exitCount == 0 && isExitBtn && target.classList.contains("empty")) {
        target.classList.remove("empty");
        target.classList.add("exit");
        exitCount++;
        return;
    } else if (target.classList.contains("begin")) {
        target.classList.remove("begin");
        target.classList.add("empty");
        isBeginBtn = false;
        if (beginBtn.classList.contains("begin")) {
            beginBtn.classList.remove("begin");
        } else {
            beginBtn.classList.add("begin");
        }
        beginCount--;
        return;
    } else if (target.classList.contains("exit")) {
        target.classList.remove("exit");
        isExitBtn = false;
        exitCount--;
        if (exitBtn.classList.contains("exit")) {
            exitBtn.classList.remove("exit");
        } else {
            exitBtn.classList.add("exit");
        }
        return;
    }
    if (target.classList.contains("wall")) {
        target.classList.remove("wall");
        target.classList.add("empty");
        return;
    } else if (target.classList.contains("empty")) {
        target.classList.remove("empty");
        target.classList.add("wall");
        return;
    } else {
        return;
    }
}   

start.onclick = function() {
    if (!beginCount || !exitCount) {
        alert("Please, select Begin or Exit before clicking Start");
        return;
    }
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[0].cells.length; j++) {
            if (table.rows[i].cells[j].classList.contains("begin")) {
                beginInd = i * table.rows[0].cells.length + j;
                weights[beginInd] = 0;
            } 
            if (table.rows[i].cells[j].classList.contains("exit")) {
                exitInd = i * table.rows[0].cells.length + j;
            } 
        }
    }
    queue.push(beginInd);
    while (queue.length != 0) {
        let temp = queue.shift();
        findPath(temp);
    }
    if (!isReal) {
        console.log("unreal");
    } else {
        printPath(exitInd);
    } 
}

function printPath(index) {
    let tmpWeights = [];
    let minInd = index;
    let temp = minInd;
    let minWeight = 999;
    while (weights[temp] != 0) {
        if ((temp + 1) % 10 != 0) {
            if ((weights[temp + 1] < weights[temp]) && (weights[temp + 1] < minWeight)) {
                minInd = temp + 1;
                minWeight = weights[temp + 1];
            }
        }
        if (temp < 90) {
            if ((weights[temp + 10] < weights[temp]) && (weights[temp + 10] < minWeight)) {
                minInd = temp + 10;
                minWeight = weights[temp + 10];
            }
        }
        if (temp > 9) {
            if ((weights[temp - 10] < weights[temp]) && (weights[temp - 10] < minWeight)) {
                minInd = temp - 10;
                minWeight = weights[temp - 10];
            }
        }
        if (temp % 10 != 0) {
            if ((weights[temp - 1] < weights[temp]) && (weights[temp - 1] < minWeight)) {
                minInd = temp - 1;
                minWeight = weights[temp - 1];
            }
        }
        temp = minInd;
        tmpWeights.push(temp);
        minWeight = 999;
    }
        while (tmpWeights.length != 0) {
            temp = tmpWeights.shift();
            if ((temp == beginInd) && (temp == exitInd)) {
                continue;
            } else {
                let col = temp % 10;
                let row = parseInt(temp / 10);
                if (table.rows[row].cells[col].classList.contains("emptyPass")) {
                    table.rows[row].cells[col].classList.remove("emptyPass");
                    table.rows[row].cells[col].classList.add("path");
                } else if (table.rows[row].cells[col].classList.contains("empty")) {
                    table.rows[row].cells[col].classList.remove("empty");
                    table.rows[row].cells[col].classList.add("path");
                } else {
                    table.rows[row].cells[col].classList.add("path");
                }
            }

        }
}

function findPath(index) {
    let col = index % 10;
    let row = parseInt(index / 10);
    
    if ((index + 1) % 10 != 0) {
        if (index + 1 == exitInd) {
            isReal = true;
        }
        if (table.rows[row].cells[col + 1].classList.contains("empty")) {
            if (weights[index + 1] >= weights[index] + 1) {
                weights[index + 1] = weights[index] + 1;
                table.rows[row].cells[col + 1].classList.remove("empty");
                table.rows[row].cells[col + 1].classList.add("emptyPass");
                // table.rows[row].cells[col + 1].innerHTML = weights[index + 1];
                queue.push(index + 1);
            }
        }
    }
    if (index < 90) {
        if (index + 10 == exitInd) {
            isReal = true;
        }
        if (table.rows[row + 1].cells[col].classList.contains("empty")) {
            if (weights[index + 10] >= weights[index] + 1) {
                weights[index + 10] = weights[index] + 1;
                table.rows[row + 1].cells[col].classList.remove("empty");
                table.rows[row + 1].cells[col].classList.add("emptyPass");
                // table.rows[row + 1].cells[col].innerHTML = weights[index + 10];
                
                queue.push(index + 10);
            }
        }
    }
    if (index > 9) {
        if (index - 10 == exitInd) {
            isReal = true;
        }
        if (table.rows[row - 1].cells[col].classList.contains("empty")) {
            if (weights[index - 10] >= weights[index] + 1) {
                weights[index - 10] = weights[index] + 1;
                table.rows[row - 1].cells[col].classList.remove("empty");
                table.rows[row - 1].cells[col].classList.add("emptyPass");
                // table.rows[row - 1].cells[col].innerHTML = weights[index - 10];
                queue.push(index - 10);
            }
        }
    }
    if (index % 10 != 0) {
        if (index - 1 == exitInd) {
            isReal = true;
        }
        if (table.rows[row].cells[col - 1].classList.contains("empty")) {
            if (weights[index - 1] >= weights[index] + 1) {
                weights[index - 1] = weights[index] + 1;
                table.rows[row].cells[col - 1].classList.remove("empty");
                table.rows[row].cells[col - 1].classList.add("emptyPass");
                // table.rows[row].cells[col - 1].innerHTML = weights[index - 1];
                queue.push(index - 1);
            }
        }
    }
}