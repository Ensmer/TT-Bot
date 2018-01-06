const formatLapTimes = function (lapTimes) {
    let message = "";
    lapTimes.forEach(((value, index) => {
        message = message.concat((index + 1) + ". " + value.UserName + " " + msToTime(value.LapTime) + "\n")
    }));
    if (message == "") {
        message = "No Times Set"
    }
    return message
};

function msToTime(s) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    // let hrs = (s - mins) / 60;

    return mins + ':' + secs + '.' + ms;
}

module.exports.formatLapTimes = formatLapTimes;