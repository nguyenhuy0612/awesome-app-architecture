import BleRepository from '../../../../../data/repositories/ble/BleRepository.js'
import Constants from '../../../../../utils/Constants.js'
import { logDebug } from '../../../../../utils/logger/Logger.js'
import { stringToBytes } from "convert-string"

const LOG_TAG = Constants.LOG.BT_USECASE_LOG
const DUMMY_VALUE = stringToBytes("\x00" + "\x05" + "\x00" + "DUMMY")

const RequestDeviceInfoUseCase = () => {

    /**
     * ble repository's api that sends ble characteristic data.
     */
    const { sendBleCustomValue } = BleRepository()

    /**
     * Execute the use case. 
     */
    executeGetDeviceInfoUseCase = () => {
        logDebug(LOG_TAG, ">>> ### triggered executeGetDeviceInfoUseCase")
        return execute(DUMMY_VALUE)
    }

    executeRefreshDeviceInfoUseCase = () => {
        logDebug(LOG_TAG, ">>> ### triggered executeRefreshDeviceInfoUseCase")
        return execute(DUMMY_VALUE)
    }

    executeGetStepInfoUseCase = () => {
        logDebug(LOG_TAG, ">>> ### triggered executeGetStepInfoUseCase")
        return execute(DUMMY_VALUE)
    }

    executeGetSleepInfoUseCase = () => {
        logDebug(LOG_TAG, ">>> ### triggered executeGetSleepInfoUseCase")
        return execute(DUMMY_VALUE)
    }

    executeGetHrInfoUseCase = () => {
        logDebug(LOG_TAG, ">>> ### triggered executeGetHrInfoUseCase")
        return execute(DUMMY_VALUE)
    }

    /**
     * call sendBleCustomValue defined in BleRepository.
     * @returns {Promise}
     */
    execute = (value) => {
        return new Promise((fulfill, reject) =>
            sendBleCustomValue(value)
                .then(() => fulfill())
                .catch((e) => reject(e)))
            .catch((e) => reject(e))
    }

    return {
        executeGetDeviceInfoUseCase,
        executeRefreshDeviceInfoUseCase,
        executeGetStepInfoUseCase,
        executeGetSleepInfoUseCase,
        executeGetHrInfoUseCase
    }
}

/**
 * export bluetooth usecase.
 */
export default RequestDeviceInfoUseCase