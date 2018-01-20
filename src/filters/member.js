class MemberFilter {
    constructor(memberIds) {

        this.filterLapTimes = (lapTimes) => {
            return lapTimes.filter(value =>
                memberIds.includes(value.steamId)
            )
        }
    }
}

module.exports = MemberFilter;