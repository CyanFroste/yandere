import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import {ImageButton} from '../res/YButton';
import downloadImage from '../shared/Downloader';
import ImageViewer from 'react-native-image-zoom-viewer-fix'; // https://www.npmjs.com/package/react-native-image-zoom-viewer-fix

const Preview = ({post, tags, tagPress}) => {
  const [previewIsVisible, isVisible] = useState(false);

  const displayOriginalSize =
    Math.ceil((post.file_size / 1024 / 1024 + Number.EPSILON) * 100) / 100;
  const compressedSize =
    Math.round((post.jpeg_file_size / 1024 / 1024 + Number.EPSILON) * 100) /
    100;
  const displayCompressedSize =
    compressedSize === 0 ? displayOriginalSize : compressedSize;

  // components inside the flatlist
  const components = [
    {
      component: (
        <TouchableWithoutFeedback onPress={() => isVisible(true)}>
          <View>
            <Image source={{uri: post.preview_url}} style={styles.image} />
          </View>
        </TouchableWithoutFeedback>
      ),
      id: 'imagePreview',
    },
    {
      component: (
        <View style={styles.downloadButton}>
          <ImageButton
            icon="download"
            text={`compressed (${displayCompressedSize} Mb)`}
            onPress={() => downloadImage(post, 'compressed')}
          />
        </View>
      ),
      id: 'downloadCompressed',
    },
    {
      component: (
        <View style={styles.downloadButton}>
          <ImageButton
            icon="download"
            text={`original (${displayOriginalSize} Mb)`}
            onPress={() => downloadImage(post, 'original')}
          />
        </View>
      ),
      id: 'downloadOriginal',
    },
    {
      component: (
        <View style={styles.tags}>
          <Text style={globalStyles.text}>Tags</Text>
          <View style={globalStyles.tagsList}>
            {tags &&
              tags.map(tag => (
                <Text
                  key={tag.id}
                  style={globalStyles.tag}
                  onPress={() => tagPress(tag.name)}>
                  {' '}
                  {tag.name}{' '}
                </Text>
              ))}
          </View>
        </View>
      ),
      id: 'tags',
    },
    {
      component: (
        <View style={styles.details}>
          <Text style={globalStyles.text}>Details</Text>
          <Text style={styles.detail}> Id: {post.id} </Text>
          <Text style={styles.detail}>
            {' '}
            Original Image Resolution : {post.width} x {post.height}
          </Text>
          <Text style={styles.detail}> Posted By : {post.author}</Text>
        </View>
      ),
      id: 'details',
    },
  ];

  return (
    <View style={globalStyles.container}>
      <Modal
        transparent={true}
        onRequestClose={() => isVisible(false)}
        animationType="slide"
        statusBarTranslucent={true}
        visible={previewIsVisible}>
        <ImageViewer
          style={globalStyles.container}
          imageUrls={[{url: post.file_url}]}
          enableSwipeDown={true}
          onSwipeDown={() => isVisible(false)}
          renderIndicator={() => null}
          backgroundColor={colors.bg}
          loadingRender={() => (
            <View style={globalStyles.centralizedContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          )}
        />
      </Modal>

      <FlatList
        style={globalStyles.container}
        data={components}
        renderItem={({item}) => item.component}
      />
    </View>
  );
};

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  image: {
    height: win.height / 2,
    width: win.width,
    resizeMode: 'contain',
  },
  imagePreview: {
    width: win.width,
    height: win.height,
    backgroundColor: colors.bg,
  },
  downloadButton: {
    flexWrap: 'wrap',
    marginTop: 20,
    marginLeft: 20,
  },
  tags: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  details: {
    margin: 20,
  },
  detail: {
    marginTop: 7,
    color: colors.fontColor,
  },
});

export default Preview;
