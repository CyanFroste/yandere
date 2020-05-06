import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import PostStack from './PostStack';
import FilterStack from './FilterStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../styles/GlobalStyles';

const Tab = createMaterialBottomTabNavigator();

const MainTab = () => {
  return (
    // Main Navigator - the tab navigator which nests 2 stack navigators wrapped in a NavigationContainer
    <NavigationContainer>
      <Tab.Navigator
        activeColor={colors.accent}
        barStyle={{backgroundColor: colors.bg}}
        inactiveColor={colors.fontColor}
        labeled={false}>
        <Tab.Screen
          name="Home"
          component={PostStack}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="image" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={FilterStack}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="filter-variant" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTab;
