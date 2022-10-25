import Constants from '../../../utils/Constants.js'
import { logDebug } from '../../../utils/Logger.js'

const LOG_TAG = Constants.LOG.COMMON_USECASE_LOG

const GetDeviceNameUseCase = () => {

    /**
     * Execute the use case. 
     */
    executeGetDeviceNameUseCase = () => {
        logDebug(LOG_TAG, ">>> triggered executeGetDeviceNameUseCase")
    }
    return { executeGetDeviceNameUseCase }
}

/**
 * export bluetooth usecase.
 */
export default GetDeviceNameUseCase