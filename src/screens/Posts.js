import React, {useState, useEffect} from 'react';
import {
  RefreshControl,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import MasonryList from 'react-native-masonry-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import downloadImage from '../shared/Downloader';

const Posts = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [quickDLmode, enterQuickDLmode] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isFetchingNewPage, setFetchingNewPage] = useState(false);

  useEffect(() => {
    // function similar to one in FilteredSearchResults
    const fetchRefetch = async () => {
      try {
        console.log(`Posts: fetchRefetch() fetching page ${1}...`);
        const response = await fetch(
          `https://yande.re/post.json?page=${1}&limit=${limit}`,
        );
        const imagesData = await response.json();
        const previewImagesData = imagesData.map(imageData => ({
          id: imageData.id,
          uri: imageData.preview_url,
          dimensions: {
            height: imageData.preview_height,
            width: imageData.preview_width,
          },
        }));
        setData(previewImagesData);
        setFullData(imagesData);
        setPage(2);
      } catch (error) {
        console.log(error);
      } finally {
        console.log(`Posts: fetchRefetch() fetching of page ${1} complete`);
        setRefreshing(false);
        setLoading(false);
      }
    };
    // call
    fetchRefetch();
  }, [isRefreshing]);

  useEffect(() => {
    // function similar to one in FilteredSearchResults
    const addMoreImages = async () => {
      try {
        console.log(`Posts: addMoreImages() fetching page ${page}...`);
        const response = await fetch(
          `https://yande.re/post.json?page=${page}&limit=${limit}`,
        );
        const imagesData = await response.json();
        const previewImagesData = imagesData.map(imageData => ({
          id: imageData.id,
          uri: imageData.preview_url,
          dimensions: {
            height: imageData.preview_height,
            width: imageData.preview_width,
          },
        }));
        setData(Array.from(new Set(data.concat(previewImagesData))));
        setFullData(Array.from(new Set(fullData.concat(imagesData))));
        setPage(page + 1);
      } catch (error) {
        console.log(error);
      } finally {
        setFetchingNewPage(false);
        console.log(`Posts: addMoreImages() fetching of page ${page} complete`);
      }
    };
    // call
    if (page !== 1) addMoreImages();
  }, [isFetchingNewPage]);

  const handleImageTap = id => {
    // function similar to one in FilteredSearchResults
    try {
      const [selectedPost] = fullData.filter(post => post.id === id);
      if (selectedPost) {
        if (quickDLmode) downloadImage(selectedPost, 'original');
        else navigation.navigate('PostDetails', {post: selectedPost});
      } else throw 'id mismatch'; // idk wtf error this is tbh : selectedPost is undefined sometimes
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={globalStyles.container}>
      {isLoading ? (
        <View style={globalStyles.centralizedContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <>
          {quickDLmode ? (
            <View style={styles.quickDLmodeControls}>
              <Text style={styles.QDMTitle}>
                {' '}
                QDM{' '}
                <Text style={styles.QDMText}>
                  {' '}
                  (tap on images to start downloading){' '}
                </Text>
              </Text>
              <Icon
                style={styles.QDMClose}
                name="close"
                onPress={() => enterQuickDLmode(false)}
              />
            </View>
          ) : null}

          <MasonryList
            images={data}
            backgroundColor={colors.bg}
            spacing={4}
            containerWidth={win.width}
            imageContainerStyle={styles.image}
            onPressImage={data => handleImageTap(data.id)}
            onLongPressImage={() => enterQuickDLmode(true)}
            onEndReached={() => {
              if (!isFetchingNewPage) setFetchingNewPage(true);
            }}
            masonryFlatListColProps={{
              refreshControl: (
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => setRefreshing(true)}
                  progressBackgroundColor={colors.bg}
                  colors={[colors.accent, colors.fontColor]}
                />
              ),
            }}
          />
        </>
      )}
    </View>
  );
};

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  quickDLmodeControls: {
    width: win.width,
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  QDMTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.fontColor,
  },
  QDMText: {
    color: colors.fontColor,
    fontStyle: 'italic',
    fontSize: 12,
  },
  QDMClose: {
    color: colors.fontColor,
    fontSize: 24,
  },
  image: {
    borderRadius: 10,
    backgroundColor: colors.darkGray,
  },
});

export default Posts;
