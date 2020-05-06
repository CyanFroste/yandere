/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
import React, {useState, useEffect} from 'react';
import {
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import downloadImage from '../shared/Downloader';

// uses component from https://luehangs.site/lue_hang/projects/react-native-masonry-list#1-clone-the-repo
import MasonryList from 'react-native-masonry-list';

const FilteredSearchResults = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState(false);
  const [tags, setTags] = useState(route.params.tags);
  const [quickDLmode, enterQuickDLmode] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isFetchingNewPage, setFetchingNewPage] = useState(false);

  useEffect(() => {
    setTags(route.params.tags);
    setRefreshing(true);
    setLoading(true);
  }, [route.params.tags]);

  useEffect(() => {
    // executes on initial render and on pull to refresh
    const fetchRefetch = async () => {
      try {
        console.log(`Filtered: fetchRefetch() fetching page ${1}...`);
        const response = await fetch(
          `https://yande.re/post.json?page=${1}&limit=${limit}&tags=${tags}`,
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
        setError(true);
      } finally {
        console.log(`Filtered: fetchRefetch() fetching of page ${1} complete`);
        setRefreshing(false);
        setLoading(false);
      }
    };
    // call
    fetchRefetch();
  }, [isRefreshing]);

  // console.log(page, data.length, fullData.length)

  useEffect(() => {
    // runs when list end is reached based on page change
    const addMoreImages = async () => {
      try {
        console.log(`Filtered: addMoreImages() fetching page ${page}...`);
        const response = await fetch(
          `https://yande.re/post.json?page=${page}&limit=${limit}&tags=${tags}`,
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
        console.log(
          `Filtered: addMoreImages() fetching of page ${page} complete`,
        );
      }
    };
    // call
    if (page !== 1) addMoreImages();
  }, [isFetchingNewPage]);

  const handleImageTap = id => {
    // does different functions based on the quickDLMode state
    try {
      const [selectedPost] = fullData.filter(post => post.id === id);
      if (selectedPost) {
        // FAST DOWNLOAD long press on image to activate this feature
        if (quickDLmode) downloadImage(selectedPost, 'original');
        // else navigate to image preview
        else navigation.navigate('ResultDetails', {post: selectedPost});
      } else throw 'id mismatch'; // idk wtf error this is tbh  : selectedPost is undefined sometimes
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
      ) : error || data.length < 1 ? (
        <View style={globalStyles.centralizedContainer}>
          <Text style={globalStyles.text}> NOT FOUND </Text>
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
                  (tap on images to start download){' '}
                </Text>
              </Text>
              <Icon
                style={styles.QDMClose}
                name="close"
                onPress={() => enterQuickDLmode(false)}
              />
            </View>
          ) : null}
          <View style={styles.filterList}>
            <Text style={globalStyles.text}>Filters</Text>
            <Text style={styles.filters}>{tags}</Text>
          </View>

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
              bounces: false,
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
  image: {
    borderRadius: 10,
    backgroundColor: colors.darkGray,
  },
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
  filterList: {
    margin: 20,
  },
  filters: {
    color: colors.fontColor,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default FilteredSearchResults;
