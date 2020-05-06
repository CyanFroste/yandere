import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Posts from '../screens/Posts';
import PostDetails from '../screens/PostDetails';

const Stack = createStackNavigator();

const PostStack = () => {
  // Stack navigator nested inside the first tab with 2 screens
  return (
    <Stack.Navigator initialRouteName="Posts" headerMode="none">
      <Stack.Screen name="Posts" component={Posts} />
      <Stack.Screen name="PostDetails" component={PostDetails} />
    </Stack.Navigator>
  );
};

export default PostStack;
