const request = require('request-promise');
const xmlParser = require('xml2json');
const GroupIdentifierType = require('./GroupIdentifierType');

class SteamGroupRepository {
    constructor(groupIdentifier, groupIdentifierType) {

        this.getGroupInfo = async () => {
            // TODO
        };

        this.fetchGroupMembers = async () => {
            let memberList = [];
            let page = 1;
            let lastResponse = null;
            while (page === 1 || (lastResponse != null && lastResponse.currentPage < lastResponse.totalPages)) {
                lastResponse = await requestMemberList(groupIdentifier, page, groupIdentifierType);
                lastResponse.memberList.members.steamID64.forEach(((value) => {
                    memberList.push(value)
                }));
                page++
            }
            return memberList
        };
    }
}

const requestMemberList = async (groupIdentifier, page, groupIdentifierType) => {
    if (groupIdentifierType === GroupIdentifierType.ID) {
        return request('http://steamcommunity.com/gid/' + groupIdentifier + '/memberslistxml/?p=' + page).then(function (body) {
            return xmlParser.toJson(body, {object: true});
        })
    } else if (groupIdentifierType === GroupIdentifierType.NAME) {
        return request('http://steamcommunity.com/groups/' + groupIdentifier + '/memberslistxml/?p=' + page).then(function (body) {
            return xmlParser.toJson(body, {object: true});
        })
    }
};

module.exports = SteamGroupRepository;