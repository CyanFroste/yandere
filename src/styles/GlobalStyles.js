import {StyleSheet, Dimensions} from 'react-native';

const win = Dimensions.get('window');

const colors = {
  bg: '#070707',
  accent: '#FF4343',
  fontColor: '#FAFAFA',
  lightGray: '#EEE',
  darkGray: '#424242',
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: win.width,
    height: win.height,
    backgroundColor: colors.bg,
  },
  centralizedContainer: {
    flex: 1,
    width: win.width,
    height: win.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.fontColor,
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  tagsList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    color: colors.fontColor,
    padding: 2,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 10,
    borderColor: colors.fontColor,
  },
});

export {globalStyles, colors};
