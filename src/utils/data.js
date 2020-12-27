//offset = 0, 7, -7, 14, -14  上一周  上两周
var formatDate = (date) => {
    var year = date.getFullYear();//年
    var month = (date.getMonth() + 1);//月
    var day = date.getDate();//日;
    return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
};
var getWeekDayList = offset => {
    let date = new Date()
    date.setDate(date.getDate() + offset)
    let weekday = date.getDay()

    //获取到周一日期
    date.setDate(date.getDate() - (weekday == 0 ? 7 : weekday) + 1)
    let weekdayList = [formatDate(date)]
    for (let i = 1; i < 7; i++) {
        date.setDate(date.getDate() + 1)
        weekdayList.push(formatDate(date))
    }
    return weekdayList
}

module.exports = {
    getWeekDayList
}

