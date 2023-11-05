'use strict'

// DIV VARIABLE FOR EVENTLISTENER
const clicked = document.getElementById("formSubmit")

// INITIAL ELEMENTS FOR CALCULATION
let days = '';
let month = '';
let year ='';
const currentDate = new Date();

// ERROR MESSAGES
const validError = "Enter valid ";
const requireError = "This field is required";
const dateError= "Must be a valid date";

// FORM VALIDATION VARIABLES
let submitted = false;
const elements = ["day", "month", "year"];
const dayElement = ["day"];
const monthElement = ["month"];
const yearElement = ["year"];
const longMonths = [1,3,5,7,8,10,12]


// EVENT LISTENER
clicked.addEventListener('click', function() {
    submitted = true;

    let dayVal = document.getElementById("day-value").value;
    let monthVal = document.getElementById("month-value").value;
    let yearVal = document.getElementById("year-value").value;

    if (dayVal === "" && monthVal === "" && yearVal === ""){
        setErrorMsg(elements, requireError)
        changeStyle(elements);
    } else if (dayVal > 31 || dayVal < 1) {
        setErrorMsg(dayElement, validError + "day")
        changeStyle(dayElement);
    } else if (!isLongMonth(monthVal) && dayVal > 30 || monthVal === 2 && dayVal >= 29) {
        setErrorMsg(dayElement, dateError)
        changeStyle(elements);
    } else if (monthVal < 1 || monthVal > 12) {
        setErrorMsg(monthElement, validError + "month");
        changeStyle(monthElement)
    } else if (yearVal < 1890 || yearVal > currentDate.getFullYear()) {
        setErrorMsg(yearElement, validError + "year (MUst be between 1890 and today's year)");
        changeStyle(yearElement)
    } else {
        calculate();
        writeResult();
    }
});

elements.forEach(function (e) {
        document.getElementById(e + "-value").addEventListener("focus", validate);
    })

// VALIDATION FUNCTIONS
function validate() {
    if (submitted) {
        resetStyle(elements);
        submitted = false;
    }
}

function isLongMonth(month) {
    longMonths.forEach(function (e) {
        if (e === month) {
            return true;
        }
    })
    return false;
}

function setErrorMsg(element, errMsg){
        element.forEach(function (e) {
            document.getElementById(e + "-error").innerHTML = errMsg;
        })

}

function changeStyle(element) {
    element.forEach(function(e) {
        document.getElementById(e + "-label").setAttribute("class", "errorLabel");
        document.getElementById(e + "-value").style.border = ".1rem solid hsl(0, 100%, 67%)";

    })

}

function resetStyle(element) {
    element.forEach(function (e) {
        document.getElementById( e + "-error").innerHTML = "";
        document.getElementById(e + "-label").classList.remove("errorLabel");
        document.getElementById(e + "-value").style.border = "1px solid hsl(0, 0%, 94%)";
        document.getElementById(e + "-value").value = "";
        document.getElementById("result-" + e + "s").innerHTML = "- -";
    })

}

// CALCULATION FUNCTIONS
function calculate() {
    year = parseInt(document.getElementById("year-value").value);
    month = parseInt(document.getElementById("month-value").value);
    days = parseInt(document.getElementById("day-value").value);

    let {difYear, difMonth, difDays} = getDifference(year, month, days);

    // for more precise month calculation the value is a median (4*7*31 + 4*4*30 + 3*28 + 1*29) / 48 = 30.4375
    let monthLength = 30.4375;

    if (difDays < 0) {
        difMonth--;
        difDays = Math.floor(difDays + monthLength);
    }

    if (difMonth < 0) {
        difYear--;
        difMonth += 12;
    }

    if (difYear < 0) {
        difYear = 0;
    }
    if (difMonth < 0) {
        difMonth = 0;
    }
    if (difDays < 0) {
        difDays = 0;
    }
    year = difYear;
    month = difMonth;
    days = difDays;

}

function getDifference(year, month, days) {
    let difYear = currentDate.getFullYear() - year;
    let difMonth = currentDate.getMonth() - month + 1;
    let difDays = currentDate.getDate() - days;

    return {difYear, difMonth, difDays};
}

function writeResult() {
    let start = 0;
    let yearObj = document.getElementById("result-years");
    let monthObj = document.getElementById("result-months");
    let daysObj = document.getElementById("result-days");
    animateValue(yearObj, start, year, 700);
    animateValue(monthObj, start, month, 500);
    animateValue(daysObj, start, days, 700);
}

function animateValue(obj, start, end, duration) {
    let startTime = null;
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsedTime = currentTime - startTime;

        const value = start + (end - start) * (elapsedTime / duration);

        obj.textContent = Math.floor(value);

        if (elapsedTime < duration) {
            requestAnimationFrame(animation);
        } else {
            obj.textContent = end;
        }
    }

    requestAnimationFrame(animation);
}



