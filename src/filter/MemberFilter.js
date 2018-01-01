class MemberFilter {
    constructor(memberIds) {

        this.filterLapTimes = (lapTimes) => {
            return lapTimes.filter(value =>
                memberIds.includes(value.SteamId)
            )
        }
    }
}

module.exports = MemberFilter;