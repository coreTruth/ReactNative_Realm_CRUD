/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Realm from 'realm';
import db from './lib/realm2';
let datas = [];
let _this = null;
export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { db: null, isLoaded: false };
  }

  componentDidMount() {
    let testDatabase = db.sort(true);
    //console.warn(testDatabase);
    if (this.state.isLoaded == false) {
      datas = testDatabase;
      this.setState({ isLoaded: true });
    }
    //console.warn(testDatabase);
    /*  Realm.open({
       schema: [{name: 'Dog', properties: {name: 'string'}}]
     }).then(realm => {
       realm.write(() => {
         realm.create('Dog', {name: 'Rex'});
       });
       
     }); */

    //this.rooms = database.objects('subscriptions').filtered('rid = $0', this.rid);
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const { db } = this.state;
    if (db !== null && !db.isClosed) {

    }
  }

  deleteData(dataId, tableID) {
    let testDatabase = db.delete(dataId, tableID);
    datas = testDatabase;
    this.setState({ isLoaded: true });
    // if (this.state.isLoaded == false) {
    //   datas = testDatabase;
    //   this.setState({ isLoaded: true });
    // }
  }

  addNewData = () => {
    this.setState({ db: db.create() });
  }

  renderItem = ({ item }) => {
    // console.warn(item); 
    if (item.isValid && item.isValid()) {
      return (
        <View style={{ flex: 1, borderBottomWidth: 1 }}>
          <Text>Id : {item.id}</Text>
          <Text>Date : {item.date.toString()}</Text>
          <Text>Shift : {JSON.stringify(item.shifts)}</Text>
          <Text>Remark : {JSON.stringify(item.remark)}</Text>
          <Text>dayPlan : {item.dayPlan}</Text>
          <Text>hours :{JSON.stringify(item.hours)}</Text>

          <TouchableOpacity onPress={() => { this.deleteData(item.id, 0) }} style={{ borderTopWidth: 1, backgroundColor: 'red' }}><Text style={{ color: "#fff", textAlign: 'center' }}>Delete Row</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.deleteData(item.id, 1) }} style={{ borderTopWidth: 1, backgroundColor: 'red' }}><Text style={{ color: "#fff", textAlign: 'center' }}>Delete Shifts</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.deleteData(item.id, 2) }} style={{ borderTopWidth: 1, backgroundColor: 'red' }}><Text style={{ color: "#fff", textAlign: 'center' }}>Delete ClockOut</Text></TouchableOpacity>

        </View>
      );
    }
    return null;
  }

  render() {
    _this = this;
    /*  const info = this.state.realm
       ? 'Number of dogs in this Realm: ' + this.state.realm.objects('Dog').length
       : 'Loading...'; */
    const info = 1;
    return (

      <View style={styles.container}>
        <TouchableOpacity onPress={this.addNewData} style={{ borderBottomWidth: 1, backgroundColor: 'green', textAlign: 'center' }}><Text style={{ color: '#fff', textAlign: 'center' }}>Add New Row</Text></TouchableOpacity>
        <FlatList
          data={datas}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={item => item._id}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
