//offset = 0, 7, -7, 14, -14  上一周  上两周
const getWeekDayList = offset => {

    var date = new Date();
    var currentFirstDate=new Date(date);
    var formatDate = function(date){
        var year = date.getFullYear();//年
        var month = (date.getMonth() + 1);//月
        var day = date.getDate();//日;
        return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
    };
    var addDate= function(date,n){
        date.setDate(date.getDate() + n);
        return date;
    };
    var setDate = function(date){
        var week = date.getDay() - 1;
        date = addDate(date, week * -1);
        currentFirstDate = new Date(date);
        var weekList=[];
        for(var i = 0; i < 7; i++){
            weekList[i] = formatDate(i == 0 ? date : addDate(date, 1));
        }
        return weekList
    };

    return setDate(addDate(currentFirstDate, offset))
}

module.exports = {
    getWeekDayList
}