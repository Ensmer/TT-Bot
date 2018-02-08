import cheerio from 'cheerio'
import request from "request-promise";

class LeaderboardRepository {

    constructor(trackId, vehicleId) {

        this.fetchLapTimes = async () => {
            let lapTimes = [];
            let page = 1;
            let lastResponse = null;
            while (page === 1 || (lastResponse != null && lastResponse.currentPage < lastResponse.totalPages)) {
                lastResponse = await requestLeaderboard(trackId, vehicleId, page);
                lastResponse.lapTimes.forEach(((value) => {
                    lapTimes.push(value)
                }));
                page++
            }
            return lapTimes
        };
    }
}

const requestLeaderboard = async (trackId, vehicleId, page) => {
    return request(`http://cars2-stats-steam.wmdportal.com/index.php/leaderboard?track=${trackId}&vehicle=${vehicleId}&page=${page}`).then(function (body) {
        let $ = cheerio.load(body);
        let lapTimes = [];
        $('#leaderboard').find('tbody tr').each((index, element) => {
            let entry = {};
            entry.overallRank = lastSubstringAfter($(element).find('.rank').attr('id'), '_');
            entry.steamId = lastSubstringAfter($(element).find('.user').attr('id'), '_');
            entry.steamName = $(element).find('.user').find('a').text();
            entry.lapTime = $(element).find('.time').find('.time').text();
            entry.sectorTimes = parseSectorTimes($(element).find('.time').attr('title'));
            entry.gap = $(element).find('.gap').find('.gap').text();
            entry.details = parseDetails($(element).find('.assists').find('img'));
            entry.date = $(element).find('.timestamp').text();
            lapTimes[index] = entry;
        });
        let response = {};
        response.lapTimes = lapTimes;

        $('#pager_bottom_select_page').find('option').each((index, element) => {
            if ($(element).attr('selected') != null)
                response.currentPage = $(element).text();
            response.totalPages = $(element).text();
        });

        if (response.currentPage == null)
            response.currentPage = 1;
        if (response.totalPages == null)
            response.totalPages = 1;

        return response
    });
};

const lastSubstringAfter = (string, splitter) => {
    let parts = string.split(splitter);
    return parts[parts.length - 1];
};

const parseSectorTimes = (sectorTimesString) => {
    let string = sectorTimesString.replace(/\n/g, ',');
    string = string.replace(/ /g, '');
    let parts = string.split(',');
    let jsonString = '[';
    parts.forEach(((value, index) => {
        let jsParts = value.split(':');
        jsonString = jsonString.concat(`"${jsParts[1]}:${jsParts[2]}"`);
        if (index == parts.length - 1)
            jsonString = jsonString.concat(']');
        else
            jsonString = jsonString.concat(',');
    }));
    return JSON.parse(jsonString)
};

const parseDetails = (element) => {
    let details = {};
    // details.drivingModel = lastSubstringAfter(element[0].attribs.title, 'Driving models: ');
    details.setup = lastSubstringAfter(element[0].attribs.title, 'Setup: ');
    details.controller = lastSubstringAfter(element[1].attribs.title, 'Controller: ');
    details.camera = lastSubstringAfter(element[2].attribs.title, 'Camera: ');
    details.drivingAids = parseDrivingAids(element[3].attribs.title);
    return details;
};

const parseDrivingAids = (drivingAidsString) => {
    let drivingAids = {};
    let parts = drivingAidsString.split('\n');
    const getBool = (string) => {
        let split = string.split(': ');
        return split[1] == 'On';
    };
    drivingAids.steeringAssist = getBool(parts[0]);
    drivingAids.brakingAssist = getBool(parts[1]);
    drivingAids.abs = getBool(parts[2]);
    drivingAids.tractionControl = getBool(parts[3]);
    drivingAids.stabilityControl = getBool(parts[4]);
    drivingAids.damage = !getBool(parts[5]);
    drivingAids.automaticGears = getBool(parts[6]);
    drivingAids.automaticClutch = getBool(parts[7]);
    drivingAids.drivingLine = getBool(parts[8]);

    return drivingAids;
};

module.exports = LeaderboardRepository;