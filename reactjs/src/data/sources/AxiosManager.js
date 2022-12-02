import axios from 'axios'
import { logDebugWithLine, outputErrorLog } from '../../utils/logger/Logger'
import { API_GET_ACTIVITIES, API_GET_ACTIVITIES_EXTRAS, API_SMS_SEND } from './ApiUrl'

const LOG_TAG = "AxiosManager"

/**
 * activities query item size.
 */
const ONLY_RECENT = 1

/**
 * axios default setting.
 */
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

/**
 * axios manager for handling http get, post and etc.
 */
function AxiosManager() {

    /**
     * call api which gets activities information.
     * @param {string} watchMobileNumber 
     * @param {Array} types 
     * @returns {Promise}
     */
    function getActivities(watchMobileNumber, types = null) {
        return new Promise((fulfill, reject) => {
            let params = {
                watchMobileNumber: watchMobileNumber,
                types: types == null ? [] : types,
                size: ONLY_RECENT
            }
            axiosGet(API_GET_ACTIVITIES, params).then((response) => {
                fulfill(response)

            }).catch((e) => {
                outputErrorLog(LOG_TAG, e + " occurred by axiosGet")
                reject(e)
            })
        })
    }

    /**
     * call api which gets activities information with extra data.
     * @param {string} watchMobileNumber
     * @param {string} types
     * @param {string} startDateTime
     * @returns {Promise}
     */
    function getActivitiesWithExtraData(watchMobileNumber, types, startDateTime) {
        return new Promise((fulfill, reject) => {
            let params = {
                watchMobileNumber: watchMobileNumber,
                types: types,
                startDateTime: startDateTime
            }
            axiosPost(API_GET_ACTIVITIES_EXTRAS, params).then((response) => {
                fulfill(response)

            }).catch((e) => {
                outputErrorLog(LOG_TAG, e + " occurred by axiosPost")
                reject(e)
            })
        })
    }

    /**
     * ask device to send SMS message.
     * @param {string} sendTo 
     * @param {string} sender 
     * @param {Any} type 
     * @returns {Promise}
     */
    function sendSmsMessage(sendTo, sender = "112", type = "ONDEMAND_POLICE_REPORT") {
        return new Promise((fulfill, reject) => {
            let params = {
                sendTo: sendTo,
                sender: sender,
                type: type,
                extra: null
            }
            axiosPost(API_SMS_SEND, params).then((response) => {
                fulfill(response)

            }).catch((e) => {
                outputErrorLog(LOG_TAG, e + " occurred by axiosPost")
                reject(e)
            })
        })
    }

    /**
     * execute HTTP GET.
     * @param {Any} params
     * @returns {Promise}
     */
    function axiosGet(apiUrl, params) {
        return new Promise((fulfill, reject) => {
            axios.get(apiUrl, { params }, { withCredentials: true }).then((response) => {
                fulfill(getResponse(apiUrl, response))

            }).catch((e) => {
                outputErrorLog(LOG_TAG, e + " occurred by axios.get")
                reject(e)
            })
        })
    }

    /**
     * execute HTTP POST.
     * @param {Any} params 
     * @returns {Promise}
     */
    function axiosPost(apiUrl, params) {
        return new Promise((fulfill, reject) => {
            axios.post(
                apiUrl, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then((response) => {
                fulfill(getResponse(apiUrl, response))

            }).catch((e) => {
                outputErrorLog(LOG_TAG, e + " occurred by axios.post")
                reject(e)
            })
        })
    }

    /**
     * get response data corresponding to each api with debugging log messages.
     * @param {string} apiUrl 
     * @param {Any} response 
     * @returns {Any}
     */
    function getResponse(apiUrl, response) {
        if (apiUrl == API_SMS_SEND) {
            const responseData = response.data

            logDebugWithLine(LOG_TAG, "response: " + JSON.stringify(response))
            logDebugWithLine(LOG_TAG, "response.data: " + JSON.stringify(responseData))
            return responseData

        } else {
            const responseData = response.data.data

            logDebugWithLine(LOG_TAG,
                "<<< response length: " + responseData.length
                + ", response: " + responseData
                + ", response [raw]: " + JSON.stringify(response))

            return responseData
        }
    }

    return {
        getActivities,
        getActivitiesWithExtraData,
        sendSmsMessage
    }
}

export default AxiosManager