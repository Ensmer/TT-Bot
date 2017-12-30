const request = require('request-promise');

class LeaderboardRepository {

    constructor(trackId, vehicleId) {

        this.fetchLapTimes = async () => {
            let lapTimes = [];
            let page = 1;
            let lastResponse = null;
            while (page === 1 || (lastResponse != null && lastResponse.Page < lastResponse.Pages)) {
                lastResponse = await requestLeaderboard(trackId, vehicleId, page);
                lastResponse.Times.forEach(((value) => {
                    lapTimes.push(value)
                }));
                page++
            }
            return lapTimes
        };
    }
}

const requestLeaderboard = async (trackId, vehicleId, page) => {
    return request('http://pcars.13ms.de/api/times?track=' + trackId + '&vehicle=' + vehicleId + '&page=' + page).then(function (body) {
        return JSON.parse(body)
    })
};

module.exports = LeaderboardRepository;

