const formatLapTimes = function (lapTimes) {
    let message = "";
    lapTimes.forEach(((value, index) => {
        message = message.concat((index + 1) + ". " + value.steamName + " " + value.lapTime + "\n")
    }));
    if (message == "") {
        message = "No Times Set"
    }
    return message
};

module.exports.formatLapTimes = formatLapTimes;