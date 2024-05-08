import React, {useState} from 'react';
import {View, Text, Pressable, SafeAreaView, BackHandler, TextInput, TouchableOpacity, Alert} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import bcrypt from 'react-native-bcrypt'; 
import { openDatabase } from "react-native-sqlite-storage";
import SelectDropdown from 'react-native-select-dropdown';
import database from '../../components/Handlers/database';

const schedulerDB = openDatabase({name: 'Scheduler.db'});
const accountsTableName = 'account';

const HomeScreen = () => {

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [retype, setRetype] = useState('');
  const [type, setType] = useState('');

  const typeNames = ['Project manager', 'Resource Manager', 'Team member', 'Portfolio viewer', 'Adminstrator'];

  const [securityTextEntry, setSecuritTextEntry] = useState(true);
1

  const onSumbit = async () => {
    if (!username || !password || !retype || !type){
      Alert.alert('Invalid Input', 'To create a Scheduler account you must do the following:\n Enter a username\n Enter a password\n Re-enter your password\n Select and account type');
      return;
    }

    schedulerDB.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM ${accountsTableName} WHERE username = "${username}"`,
        [],
        (_,res) => {
          let user = res.rows.length; 
          if (user>=1){
            Alert.alert('Invalid User', 'Username already exists');
            return;
          } else {
              if ( password == retype ){
                let salt = bcrypt.genSaltSync(3);
                let hash = bcrypt.hashSync(password, salt);
                database.addAccount(username, password, hash);
                Alert.alert('Account Created', 'Account Created!');
                navigation.navigate('Home');
              }else{
                Alert.alert('Invalid Input', 'Passsword and re-enter password are not the same.');
              }
          
          }
        },
        error => {
          console.log('Error getting user ' + error.message);
        }
      );
    });
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 0.0}} />
      <View style={styles.header}>
        <Text style={styles.title}>
          Scheduler
        </Text>
        <TextInput
          placeholder='Enter Username'
          placeholderTextColor='grey'
          value={username}
          autoCapitalize='none'
          onChangeText={setUsername}
          style={{
            color: 'black',
            fontSize: 16,
            width: '100%',
            marginVertical: 15,
            borderColor: 'lightgrey', 
            borderBottomWidth: 1.0,
            paddingTop: 100,
          }}
        />
        <TextInput
          placeholder='Enter Password'
          placeholderTextColor='grey'
          value={password}
          autoCapitalize='none'
          onChangeText={setPassword}
          secureTextEntry={securityTextEntry}
          style={{
            color: 'black',
            fontSize: 16,
            width: '100%',
            marginVertical: 15,
            borderColor: 'lightgrey', 
            borderBottomWidth: 1.0,
            paddingTop: 0,
          }}
        />
        <TextInput
          placeholder='Retype Password'
          placeholderTextColor='grey'
          value={retype}
          autoCapitalize='none'
          onChangeText={setRetype}
          secureTextEntry={securityTextEntry}
          style={{
            color: 'black',
            fontSize: 16,
            width: '100%',
            marginVertical: 15,
            borderColor: 'lightgrey', 
            borderBottomWidth: 1.0,
            paddingTop: 0,
          }}
        />
        <SelectDropdown
                data={typeNames}
                defaultValue={type}
                defaultButtonText={'Select Account Type'}
                onSelect={(selectedItem, index) => {
                    setType(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                dropdownStyle={styles.dropdownDropdownStyle}
                rowStyle={styles.dropdownRowStyle}
                rowTextStyle={styles.dropdownRowTxtStyle}
            />
        <Pressable
          style={styles.button}
          onPress={() => onSumbit()}>
          <Text style={styles.buttonText}>Create Your Account</Text>
        </Pressable>
        <Text 
            style={{
            color: 'grey',
            fontSize: 16,
            width: '100%',
            marginHorizontal: 100,
            marginVertical: 0,
            marginTop: 20
          }}>Already have and account?</Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Sign In Now')}>
          <Text style={styles.buttonText}>Sign in Now</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;