import { logger } from '@utils/logger';
import AppState from './data-store/app-state';
import DbAccess from '@services/data-store/db-access';

const COMPONENT = 'datastore'

class DataStore {
    constructor() {
        // DbAccess.bootstrap()
        // .then(_flag => AppState.bootstrap())
        // .catch((err) => {logger.debug(`${COMPONENT} bootstrap failed`, err)})
    }
}

export default new DataStore()