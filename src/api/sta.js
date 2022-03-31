import request from '@/utils/request'
export default {
    createStatistics(day) {
    return request({
    url: `/staservice/statisticsdaily/createStatisticsByDate/${day}`,
    method: 'post'
    })
    },

    showChart(searchObj) {
        return request({
        url: `/staservice/statisticsdaily/showchart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
        method: 'get'
         })
        }
}