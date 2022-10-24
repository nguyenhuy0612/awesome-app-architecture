import Constants from '../../utils/Constants.js'
import { logDebug, logError } from '../../utils/Logger.js'
import { NativeEventEmitter, NativeModules } from 'react-native'
import { useEffect } from 'react'

const bleManager = require('../sources/bluetooth/ble_manager/BleManager.js').default
const LOG_TAG = Constants.LOG.BT_REPO_LOG

/**
 * standard code for handling ble related callbacks.
 */
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

/**
 * flag for checking repository state.
 * reason : check if state I set as true is continued to keep.
 */
let repositoryState = false

/**
 * bluetooth api implementation.
 */
const BluetoothRepository = () => {

    /**
     * listeners for catching the ble events.
     */
    addBleEventListeners = () => {
        bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", this.onFoundPeripheral)
        bleManagerEmitter.addListener("BleManagerStopScan", this.onScanStopped)
        bleManagerEmitter.addListener("BleManagerDisconnectPeripheral", this.onPeripheralDisconnecrted)
        bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", this.onCharacteristicChanged)
    }

    /**
     * release listeners and subscription about ble events.
     */
    releaseBleEventListeners = () => {
        bleManagerEmitter.removeAllListeners("BleManagerDiscoverPeripheral")
        bleManagerEmitter.removeAllListeners("BleManagerStopScan")
        bleManagerEmitter.removeAllListeners("BleManagerDisconnectPeripheral")
        bleManagerEmitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic")
    }

    /**
     * refresh ble event listeners. (release and add them again.)
     */
    refreshBleEventListeners = () => {
        this.releaseBleEventListeners()
        this.addBleEventListeners()
    }

    /**
     * obtain device information that is detected by scanning device.
     * @param {Any} peripheral 
     */
    onFoundPeripheral = (peripheral) => {
        logDebug(LOG_TAG, "discovered " + peripheral.name)
    }

    /**
     * catch when the device scan is stopped.
     */
    onScanStopped = () => {
        logDebug(LOG_TAG, "stopped device scan")
        logDebug(LOG_TAG, "repositoryState: " + repositoryState)
    }

    /**
     * catch when device is disconnected.
     * @param {Any} peripheral 
     */
    onPeripheralDisconnecrted = (peripheral) => {
        logDebug(LOG_TAG, "disconnected " + peripheral)
    }

    /**
     * receive characteristic custom data that is sent from device.
     * @param {Any} characteristicCustomData 
     */
    onCharacteristicChanged = (characteristicCustomData) => {
        logDebug(LOG_TAG, "received " + characteristicCustomData)
    }

    /**
     * print error log delivered from ble manager.
     * @param {string} error 
     */
    outputErrorLog = (error) => {
        logError(LOG_TAG, error)
    }

    /** 
     * connect ble device. 
     * @param {string} peripheralId
     * @returns {Promise}
     */
    connectDevice = (peripheralId) => {
        return new Promise((fulfill, reject) => {
            bleManager.connect(peripheralId).then(() => {
                logDebug(LOG_TAG, "succeeded to connect " + peripheralId)
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(LOG_TAG, e)
                reject(e)
            })
        })
    }

    /**
     * disable notification of ble device.
     * @param {string} peripheralId 
     * @param {string} serviceUuid 
     * @param {string} characteristicUuid
     * @returns {Promise}
     */
    disableNotification = (peripheralId, serviceUuid, characteristicUuid) => {
        return new Promise((fulfill, reject) => {
            bleManager.stopNotification(peripheralId, serviceUuid, characteristicUuid).then(() => {
                logDebug(LOG_TAG, "succeeded to disable notification of " + characteristicUuid)
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * disconnect ble device.
     * @param {string} peripheralId 
     * @returns {Promise}
     */
    disconnectDevice = (peripheralId) => {
        return new Promise((fulfill, reject) => {
            bleManager.disconnect(peripheralId).then(() => {
                logDebug(LOG_TAG, "succeeded to disconnect " + peripheralId)
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * enable notification of ble device.
     * @param {string} peripheralId 
     * @param {string} serviceUuid 
     * @param {string} characteristicUuid 
     * @returns {Promise}
     */
    enableNotification = (peripheralId, serviceUuid, characteristicUuid) => {
        return new Promise((fulfill, reject) => {
            bleManager.startNotification(peripheralId, serviceUuid, characteristicUuid).then(() => {
                logDebug(LOG_TAG, "succeeded to enable notification of " + characteristicUuid)
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * initialize ble manager and enable bluetooth feature.
     * @returns {Promise}
     */
    initializeBleModule = () => {
        logDebug(LOG_TAG, "repositoryState: " + repositoryState)
        repositoryState = true
        return new Promise((fulfill, reject) => {
            bleManager.start(null).then(() => {
                logDebug(LOG_TAG, "succeeded to initialize ble manager")
                this.refreshBleEventListeners()
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * enable bluetooth (Android only)
     * @returns {Promise}
     */
    enableBluetooth = () => {
        return new Promise((fulfill, reject) => {
            bleManager.enableBluetooth().then(() => {
                logDebug(LOG_TAG, "succeeded to enable bluetooth feature")
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * get battery level of ble device.
     * @param {string} peripheralId 
     * @param {string} batteryserviceUuid 
     * @param {string} batterycharacteristicUuid
     * @returns {Promise}
     */
    getBatteryLevel = (peripheralId, batteryserviceUuid, batterycharacteristicUuid) => {
        return new Promise((fulfill, reject) => {
            bleManager.read(peripheralId, batteryserviceUuid, batterycharacteristicUuid).then((batteryLevel) => {
                logDebug(LOG_TAG, "succeeded to get battery level-" + batteryLevel)
                fulfill(batteryLevel)
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * start scanning ble device.
     * @param {string} serviceUuid 
     * @param {number} duration 
     */
    startScan = (serviceUuid, duration) => {
        logDebug(LOG_TAG, "repositoryState: " + repositoryState)
        return new Promise((fulfill, reject) => {
            var serviceUuids = []
            if (serviceUuid != null && serviceUuid != "" && serviceUuid && "undefined") {
                serviceUuids.push(serviceUuid)
            } else {
                const errorMessage = "wrong service uuids !!!"
                this.outputErrorLog(errorMessage)
                reject(errorMessage)
                return
            }
            logDebug(LOG_TAG, "service uuids for scanning: " + serviceUuids)

            bleManager.scan(serviceUuids, duration, true).then(() => {
                logDebug(LOG_TAG, "succeeded to execute scanning")
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * stop scanning ble device.
     */
    stopScan = () => {
        return new Promise((fulfill, reject) => {
            bleManager.stopScan().then(() => {
                logDebug(LOG_TAG, "succeeded in stopping the device scan")
                fulfill()
            }).catch((e) => {
                this.outputErrorLog(e)
                reject(e)
            })
        })
    }

    /**
     * get all uuid list that exists in ble device.
     * @param {Any} peripheral 
     */
    getUuidList = (peripheral) => {
        return bleManager.getUuidList(peripheral)
    }

    /**
     * retrieve services of ble device.
     * @param {string} peripheralId 
     */
    retrieveServices = (peripheralId) => {
        bleManager.retrieveServices(peripheralId).then(() => {
            logDebug(LOG_TAG, "succeeded in retrieving services")
        }).catch((e) => {
            this.outputErrorLog(e)
        })
    }

    /**
     * it's not implemented yet.
     */
    getHrInfo = () => { }

    /**
     * it's not implemented yet.
     */
    getSleepInfo = () => { }

    /**
     * it's not implemented yet.
     */
    getStepInfo = () => { }

    /**
     * it's not implemented yet.
     */
    refreshDeviceInfo = () => { }

    /**
     * it's not implemented yet.
     */
    upgradeFirmware = () => { }

    useEffect(() => {
        logDebug(LOG_TAG, "refresh ble event listeners")
        this.refreshBleEventListeners()

        return () => { };
    }, [])

    /**
     * export BluetoothRepository's functions.
     */
    return {
        initializeBleModule,
        startScan,
        connectDevice,
        disableNotification,
        disconnectDevice,
        enableNotification,
        enableBluetooth,
        getBatteryLevel,
        startScan,
        stopScan,
        getUuidList,
        retrieveServices,
        getHrInfo,
        getSleepInfo,
        getStepInfo,
        refreshDeviceInfo,
        upgradeFirmware,
    }
}

/**
 * export bluetooth repository object.
 */
export default BluetoothRepository