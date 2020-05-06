import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {globalStyles, colors} from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NormalButton} from '../res/YButton';

const AdvancedSearch = ({navigation}) => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    // fetches initially and on every page change
    const fetchControl = async () => {
      try {
        const response = await fetch(
          `https://yande.re/tag.json?order=count&limit=${14}&page=${page}&name=${searchString}`,
        );
        const tags = await response.json();        
        if (tags.length > 0) setTags(tags);
        else setTags([{id: 'NoneTag', name: 'NO TAGS FOUND'}]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    // call
    fetchControl();
  }, [page]);

  useEffect(() => {
    // runs everytime search bar text - 'searchString' is changed
    const liveSearch = async () => {
      try {
        const response = await fetch(
          `https://yande.re/tag.json?order=count&limit=${14}&page=${1}&name=${searchString}`,
        );
        const tags = await response.json();
        if (tags.length > 0) setTags(tags);
        else setTags([{id: 'NoneTag', name: 'NO TAGS FOUND'}]);
      } catch (error) {
        console.log(error);
        setSearchString('');
      } finally {
        setPage(1);
      }
    };
    // call
    liveSearch();
  }, [searchString]);

  const selectDeselectTag = (tag, mode) => {
    // add to / remove from filters list
    if (
      mode === 'select' &&
      !selectedTags.includes(tag.name) &&
      selectedTags.length < 4
    )
      setSelectedTags([...selectedTags, tag.name]);
    else if (mode === 'deselect')
      setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const showResults = () => {
    // use tags to show results on FilteredSearchResults screen
    const tags = selectedTags.join('+');
    navigation.navigate('Results', {tags: tags});
  };

  return (
    <View style={globalStyles.container}>
      {isLoading ? (
        <View style={globalStyles.centralizedContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={globalStyles.container}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchbar}
                placeholder="Search"
                placeholderTextColor={colors.lightGray}
                onChangeText={text => setSearchString(text.toLowerCase())}
                selectionColor={colors.accent}
              />
              <Icon name="magnify" style={styles.searchIcon} />
            </View>
            <View style={styles.tags}>
              <Text style={globalStyles.text}>Tags</Text>
              <ScrollView style={styles.scrollContainer}>
                <View style={globalStyles.tagsList}>
                  {tags &&
                    tags.map(tag => (
                      <Text
                        key={tag.id}
                        style={globalStyles.tag}
                        onPress={() => selectDeselectTag(tag, 'select')}>
                        {' '}
                        {tag.name}{' '}
                      </Text>
                    ))}
                </View>
              </ScrollView>
            </View>
            <View style={styles.tagNavButtons}>
              {page === 1 ? null : (
                <NormalButton text="prev" onPress={() => setPage(page - 1)} />
              )}
              {tags[0].id === 'NoneTag' ? null : (
                <NormalButton text="next" onPress={() => setPage(page + 1)} />
              )}
            </View>
            <View style={styles.filterList}>
              <View style={styles.filterListTitleContainer}>
                <Text style={globalStyles.text}>Filters</Text>
                <Text
                  style={styles.clearFilter}
                  onPress={() => setSelectedTags([])}>
                  {' '}
                  clear{' '}
                </Text>
              </View>
              <ScrollView style={styles.scrollContainer}>
                <View style={globalStyles.tagsList}>
                  {selectedTags &&
                    selectedTags.map(tag => (
                      <Text
                        key={tag}
                        style={styles.tagSelected}
                        onPress={() => selectDeselectTag(tag, 'deselect')}>
                        {' '}
                        {tag}{' '}
                      </Text>
                    ))}
                </View>
              </ScrollView>
            </View>
            <View style={styles.filterButtonContainer}>
              <NormalButton text="filter" onPress={showResults} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 10,
    height: 180,
    maxHeight: 180,
  },
  tags: {
    margin: 20,
    marginTop: 0,
  },
  filterList: {
    margin: 20,
  },
  filterListTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearFilter: {
    color: colors.fontColor,
    fontSize: 14,
    fontStyle: 'italic',
  },
  tagSelected: {
    color: '#000',
    padding: 2,
    fontSize: 15,
    fontStyle: 'italic',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: colors.lightGray,
  },
  tagNavButtons: {
    flexDirection: 'row',
    margin: 20,
    marginVertical: 0,
    justifyContent: 'space-between',
  },
  searchContainer: {
    margin: 20,
    alignItems: 'center',
  },
  searchbar: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 40,
    height: 40,
    width: win.width - 40,
    marginTop: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 14,
    color: colors.fontColor,
  },
  searchIcon: {
    color: colors.lightGray,
    fontSize: 24,
    position: 'absolute',
    top: 18,
    right: 10,
  },
  filterButtonContainer: {
    margin: 20,
    marginTop: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default AdvancedSearch;
