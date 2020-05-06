import RNFetchBlob from 'rn-fetch-blob';

const {config, fs} = RNFetchBlob;

const downloadImage = async (post, option) => {
  // post is the array of data of a single image from the yande.re api; option = original or compressed
  let fileURL = option === 'original' ? post.file_url : post.jpeg_url;

  try {
    console.log(
      `yande.re.${post.id}.${post.tags.replace(/([^a-z0-9]+)/gi, '-')}.${
        post.file_ext
      } started downloading...`,
    );
    let pictureDir = fs.dirs.PictureDir;
    // config for android download manager - using this doesn't allow .progress() to work
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${pictureDir}/Yandere/yande.re.${post.id}.${post.tags.replace(
          /([^a-z0-9]+)/gi,
          '-',
        )}.${post.file_ext}`,
        description: 'Downloading image...',
      },
    };
    const response = await config(options).fetch('GET', fileURL);
    console.log(`Files saved as ${response.data}`);
  } catch (error) {
    console.log(error);
  }
};

export default downloadImage;
