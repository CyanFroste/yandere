import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import Preview from '../components/Preview';

const PostDetails = ({route, navigation}) => {
  const post = route.params.post;
  const tags = post.tags.split(' ').map(tag => ({id: tag, name: tag}));

  const tagPress = tag => {
    navigation.navigate('Search', {
      screen: 'Results',
      params: {tags: tag},
    });
  };

  return (
    <>
      {post ? (
        <Preview tags={tags} post={post} tagPress={tagPress} />
      ) : (
        <View style={globalStyles.centralizedContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}
    </>
  );
};

export default PostDetails;
