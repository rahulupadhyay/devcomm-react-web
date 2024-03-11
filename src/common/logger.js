
const canLog = process.env.NODE_ENV === 'development';

const log = (message) => {
    canLog && console.log(message);
}

const error = (message) => {
    canLog && console.error(message);
}

const debug = (message) => {
    canLog && console.debug(message);
}

const warn = (message) => {
    canLog && console.warn(message)
}

const info = (message) => {
    canLog && console.info(canLog);
}

export const logger = {
    log, error, debug, warn, info
}

