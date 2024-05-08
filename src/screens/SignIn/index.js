import React, {useState} from 'react';
import {View, Text, Pressable, SafeAreaView, BackHandler, TextInput, TouchableOpacity, Alert} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import bcrypt from 'react-native-bcrypt';
import { openDatabase } from "react-native-sqlite-storage";
import SelectDropdown from 'react-native-select-dropdown';

const schedulerDB = openDatabase({name: 'Scheduler.db'});
const accountsTableName = 'account';

const SignInScreen = () => {

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');

  const typeNames = ['Project manager', 'Resource Manager', 'Team member', 'Portfolio viewer', 'Adminstrator'];

  const [securityTextEntry, setSecuritTextEntry] = useState(true);


  const onSumbit = async () => {
    if (!username || !password || !type){
      Alert.alert('Invalid Input', 'To sign into Scheduler you must do the following:\nEnter your username and password\nSelect your account type');
      return;
    }

    schedulerDB.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM ${accountsTableName} WHERE username = "${username}"`,
        [],
        (_,res) => {
          let user = res.rows.length; 
          if (user==0){
            Alert.alert('Invalid Account', 'Username is invalid!');
            return;
          } else {
            let item = res.rows.item(0);
            let isPasswordCorrect = bcrypt.compareSync(password, item.password);
            if (!isPasswordCorrect){
              Alert.alert('Invalid Acount', 'Password is invalid!');
              return;
            }

            if (user != 0 && isPasswordCorrect){
              navigation.navigate('Home');
              Alert.alert('Valid Acount', 'Welcome to Schedule!');
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
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
        <Text 
            style={{
            color: 'grey',
            fontSize: 16,
            width: '100%',
            marginHorizontal: 100,
            marginVertical: 0,
            marginTop: 20
          }}>Don't have and account?</Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Create One Now</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignInScreen;