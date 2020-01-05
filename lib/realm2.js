import Realm from 'realm';
import { processColor } from 'react-native';
//import RNRealmPath from 'react-native-realm-path';

// import { AsyncStorage } from 'react-native';
// Realm.clearTestState();
// AsyncStorage.clear();

const locationSchema = {
    name: 'locationData',
    // primaryKey: 'id',
    properties: {
        latitude: { type: 'float', optional: true },
        longitude: { type: 'float', optional: true },
    }
};

const clockInSchema = {
    name: 'clockIndata',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', optional: true },
        time: { type: 'date', optional: true },
        actualTime: { type: 'date', optional: true },
        location: 'locationData'
    }
};

const clockOutSchema = {
    name: 'clockOutdata',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', optional: true },
        time: { type: 'date', optional: true },
        actualTime: { type: 'date', optional: true },
        location: 'locationData'
    }
};

const breakSchema = {
    name: 'breakdata',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', optional: true },
        type: { type: 'string', optional: true },
        startTime: { type: 'date', optional: true },
        endTime: { type: 'date', optional: true },
        location: 'locationData'
    }
};

const miscTimeSchema = {
    name: 'miscTimedata',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', optional: true },
        type: { type: 'string', optional: true },
        startTime: { type: 'date', optional: true },
        endTime: { type: 'date', optional: true },
        location: 'locationData',
        remark: { type: 'string', default: null },
    }
};


const hoursDBSchema = {
    name: 'Hourdata',
    properties: {
        regTime: { type: 'string', optional: true },
        otTime: { type: 'string', optional: true },
        dtTime: { type: 'string', optional: true },
        pwTime: { type: 'string', optional: true },
        ptoTime: { type: 'string', optional: true },
    }
};

const injuryDetailschema = {
    name: 'injuryDetailsData',
    properties: {
        isPriorShift: { type: 'bool', optional: true, default: false },
        isDuringShift: { type: 'bool', optional: true, default: false }
    }
};


const signaturechema = {
    name: 'signatureData',
    properties: {
        data: { type: 'string', optional: true },

    }
};


const shiftsSchema = {
    name: 'shiftdata',
    primaryKey: 'id',
    properties: {
        clockIn: 'clockIndata',
        clockOut: 'clockOutdata',
        break: { type: 'list', objectType: 'breakdata', default: [] },
        miscTime: { type: 'list', objectType: 'miscTimedata', default: [] },
        expectedStartTime: { type: 'date', optional: true },
        status: { type: 'string', optional: true },
        id: { type: 'int', optional: true },
        injuryDetails: 'injuryDetailsData',
        signature: 'signatureData',
        shiftCreatedOn: { type: 'date', optional: true },
    }
};

const remarkSchema = {
    name: 'remarkdata',
    properties: {
        response: { type: 'string', optional: true },
    }
};


const realMTestDBSchema = {
    name: 'realMTestDB',
    primaryKey: 'id',
    properties: {
        id: 'int',
        date: { type: 'date', optional: true },
        shifts: { type: 'list', objectType: 'shiftdata', default: [] },
        remark: { type: 'list', objectType: 'remarkdata', default: [] },
        dayPlan: { type: 'string', optional: true },
        hours: 'Hourdata',
    }
};


const schema = [
    locationSchema,
    clockInSchema,
    clockOutSchema,
    breakSchema,
    injuryDetailschema,
    signaturechema,
    miscTimeSchema,
    shiftsSchema,
    remarkSchema,
    hoursDBSchema,
    realMTestDBSchema,
];

class DB {
    databases = new Realm({ schema: schema, schemaVersion: 69 });

    sort(isAsc) {
        return this.database.objects('realMTestDB').sorted('id', isAsc);
    }

    count() {
        return this.database.objects('realMTestDB').length;
    }

    deleteAll(...args) {
        return this.database.write(() => this.database.deleteAll(...args));
    } 

    deleteChilds(processedObj) {
        for (var keys in processedObj) {
            if (typeof processedObj[keys] === 'object') {
                this.deleteChilds(processedObj[keys]);
                // this.database.write(() => {    
                //     console.log("ddd   =  " + keys + "   : " + processedObj + "  \n");              
                //     this.database.delete(processedObj[keys]);
                // })       
            } else {
            }
        }
        try {
            this.database.write(() => {
                this.database.delete(processedObj);
                console.log("success   " + processedObj)
            })
        } catch (e) {
            console.log("Error on deletion");
        }
    }
    update(recordID) {
        if (recordID > 0) {
            let filteredRecord = this.database.objects("realMTestDB").filtered('id = $0', recordID);            
            this.database.write(() => {
                console.log(filteredRecord[0]);
                this.database.create('realMTestDB', {...filteredRecord[0], dayPlan: 'working'}, 'modified');
            });
        } else {
            Alert.alert("Id can not be null");
        }
        return this.sort(true);
    }

    delete(recordID, childID) {
        if (recordID > 0) {
            let filteredRecord = this.database.objects("realMTestDB").filtered('id = $0', recordID);
            //console.log(filteredRecord[0]);
            switch (childID) {
                case 0:
                    this.deleteChilds(filteredRecord[0]);
                    break;
                case 1:
                    this.deleteChilds(filteredRecord[0].shifts);
                    break;
                case 2:
                    this.deleteChilds(filteredRecord[0].shifts[0].clockOut);
                    break;
                default:
                    break;
            }
            

        } else {
            Alert.alert("Id can not be null");
        }
        return this.sort(true);
    }

    write() {

        //return this.database.write(...args);
    }

    create() {
        const lastRecord = this.sort(true);
        console.warn(lastRecord);
        const highestId = (lastRecord == null || lastRecord.length == 0) ? 0 : lastRecord[0].id;
        this.database.write(() => {

            this.database.create('realMTestDB', {
                id: highestId + 3,
                date: new Date(),
                shifts: [
                    {
                        clockIn: {
                            id: highestId + 4,
                            time: "2019-11-24T18:58:12.08Z",
                            actualTime: "2019-11-24T18:58:12.08Z",
                            location: {
                                latitude: 68.000000000,
                                longitude: 68.000000000
                            }
                        },
                        clockOut: {
                            id: highestId + 5,
                            time: new Date(),
                            actualTime: new Date(),
                            location: {
                                latitude: 68.000000000,
                                longitude: 68.000000000
                            }
                        },
                        break: [
                            {
                                id: highestId + 6,
                                type: "lunch",
                                startTime: new Date(),
                                endTime: new Date(),
                                location: {
                                    latitude: 68.000000000,
                                    longitude: 68.000000000
                                }
                            }
                        ],
                        miscTime: [
                            {
                                id: highestId + 7,
                                type: "training",
                                startTime: new Date(),
                                endTime: new Date(),
                                location: {
                                    latitude: 68.000000000,
                                    longitude: 68.000000000
                                },
                                remark: 'dfs'
                            }
                        ],
                        expectedStartTime: new Date(),
                        status: "Submitted",
                        id: highestId + 8,
                        injuryDetails: {
                            isPriorShift: false,
                            isDuringShift: false
                        },
                        signature: {
                            data: "string"
                        },
                        shiftCreatedOn: new Date()
                    }
                ],
                remark: [],
                dayPlan: 'Not Scheduled',
                hours: {
                    regTime: '0.0',
                    otTime: '0.0',
                    dtTime: '0.0',
                    pwTime: '0.0',
                    ptoTime: '0.0'
                }
            });
            //  db.close();
            // callBack(this.sort());
        });
        return this.sort(true);
        //return this.database.write(...args);
    }

    objects(tableName: string) {
        return this.database.objects(tableName);
    }

    objectForPrimaryKey(...args) {
        return this.database.objectForPrimaryKey(...args);
    }

    get database() {
        return this.databases;
    }

}

const db = new DB();

export default db;

