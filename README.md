# yandere
## yandere - an unofficial react native application for [yande.re](https://yande.re/post)

### Features
- Browse
- Download
- Batch download by enabling QDM by long pressing an image
- Search by tag

### Technical features
- A Masonry FlatList ([source](https://luehangs.site/lue_hang/projects/react-native-masonry-list#1-clone-the-repo))
- Image Viewer ([source](https://www.npmjs.com/package/react-native-image-zoom-viewer-fix))
- Downloads ([source](https://www.npmjs.com/package/rn-fetch-blob))

### BUILD NOTES

- Command to create index.android.bundle ([source](https://medium.com/@impaachu/react-native-android-release-build-crash-on-device-14f2c9eacf18))

> react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

### BUGS 
- No search results are shown if you close the Search result screen while QDM is enabled
