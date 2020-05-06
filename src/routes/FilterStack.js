import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AdvancedSearch from '../screens/AdvancedSearch';
import FilteredSearchResults from '../screens/FilteredSearchResults';
import ResultDetails from '../screens/ResultDetails';

const Stack = createStackNavigator();

const FilterStack = () => {
  // Stack navigator nested inside the second tab with 3 screens
  return (
    <Stack.Navigator initialRouteName="SearchScreen" headerMode="none">
      <Stack.Screen name="SearchScreen" component={AdvancedSearch} />
      <Stack.Screen name="Results" component={FilteredSearchResults} />
      <Stack.Screen name="ResultDetails" component={ResultDetails} />
    </Stack.Navigator>
  );
};

export default FilterStack;
