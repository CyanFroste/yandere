import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import MainTab from './src/routes/MainTab';

const App: () => React$Node = () => {
  const requestPermissions = async () => {
    // ask permission on runtime
    try {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      if (
        permissions['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        permissions['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permission granted');
        setAccessStorage(true);
      } else {
        console.log('Permission denied');
        setAccessStorage(false);
        requestPermissions();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [accesStorage, setAccessStorage] = useState(false);

  useEffect(() => {
    if (!accesStorage) {
      requestPermissions();
    }
  });

  return (
    <>
      <MainTab />
    </>
  );
};

export default App;
