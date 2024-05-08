import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Meeting from '../../components/Meeting';
// import oponDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook to create database
const schedulerDB = openDatabase({name: 'Scheduler.db'});

// create constants for tables in database
const meetingTableName = 'meetings';
const hostMeetingsTableName = 'host_meetings';

const ViewMeetingsScreen = props => {

  const post = props.route.params.post;

  const navigation = useNavigation();

  const [meetings, setMeetings] = useState([]);
  const [nbrHosts, setNbrHosts] = useState(0);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      let results = [];
      let total = 0;
      schedulerDB.transaction(txn => {
        txn.executeSql(
          `SELECT meetings.id, title, location, date FROM ${meetingTableName}, ${hostMeetingsTableName} WHERE meetings.id = meeting_id AND host_id = ${post.id}`,
          [],
          (_, res) => {
            let len = res.rows.length;
            console.log('Length of meetings ' + len);
            if (len > 0){
              total = len;
              for (let i = 0; i < len; i++){
                let item = res.rows.item(i);
                results.push({
                  id: item.id,
                  title: item.title,
                  location: item.location,
                  date: item.date,
                });
              }
              setMeetings(results);
              setNbrHosts(total);
            } else {
              setMeetings([]);
              setNbrHosts(0);
            }
          },
          error => {
            console.log('Error getting meetings ' + error.message);
          }
        )
      });
    });
    return listener;
  });

  const ListHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.name}>For Host : {post.name}</Text>
      </View>
    );
  };

  const ListFooter = () => {
    return (
      <View style={styles.footer}>
        <Text style={styles.total}>TOTAL MEETINGS: {nbrHosts}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList 
          data={meetings}
          renderItem={({item}) => <Meeting post={item}/>}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
        />
      </View>
    </View>
  );
};

export default ViewMeetingsScreen;