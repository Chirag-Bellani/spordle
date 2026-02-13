import  { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
 
} from 'react-native';

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import { sportList } from '../../services/boxService';
import { COLORS } from '../../constants/color';
import navigationString from '../../constants/navigationString';
import { AppStackScreenProps } from '../../navigation/navigationTypes';



type Sport = {
  id: number;
  name: string;
  image: string;


};
interface SportSlideProps {
  onSportSelect: (sportId: number) => void;
  selectedSport?: number | null;
  navigation: AppStackScreenProps<'BoxDetails'>['navigation'];

  SportLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const SportSlide: React.FC<SportSlideProps> = ({
  onSportSelect,
  selectedSport,
  navigation,
  SportLoading,
  setLoading,
}) => {
  const [items, setItems] = useState<Sport[]>([]);
  
  const defaultItemCount = 4;

 
  const handleSportSelect = (sportId: number) => {
    if (typeof onSportSelect === 'function') {
      onSportSelect(sportId);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const formData = new FormData();
        formData.append('id', String(selectedSport));

        const data = await sportList(formData)
        
        if (data && (data.success === true || data.status === 200)) {
          setItems(data.data || []);
        } else {
          console.error(
            'Error fetching sport list:',
            data.message || 'Unknown error',
          );
        }
      } catch (error) {
        
        console.error('Error fetching sport list:', error);
      } finally {
       
      }
    };

    fetchItems();
  }, []);

  const displayedItems =  items.slice(0, defaultItemCount);

  const renderItem = ({ item }: { item: Sport }) => {
    const isSelected = selectedSport === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.item}
        onPress={() => handleSportSelect(item.id)}
      >
        <View
          style={[
            styles.iconContainer,
            isSelected && styles.iconContainerSelected,
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.icon} />
        </View>
        <Text style={[styles.name, isSelected && styles.nameSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View >
      <View style={styles.header}>
        <Text style={styles.title}>Sports</Text>
        {items.length > defaultItemCount && (
          <TouchableOpacity onPress={()=> navigation.navigate(navigationString.SPORTFILTERSCREEN,{sport:items})}>
            <Text style={styles.seeAll}>
             
              SeeAll
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={displayedItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsVerticalScrollIndicator={false}
      />
  

    </View>
  );
};
export default SportSlide;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateVerticalScale(10),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '400',
    color: COLORS.darkText,
    fontFamily: 'Inria Sans',
    marginTop: moderateVerticalScale(5),
  },
  seeAll: {
    fontSize: moderateScale(15),
    color: COLORS.primary,
    fontWeight: '400',
    fontFamily: 'Inria Sans',
    marginTop: moderateVerticalScale(5),
  },
  row: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  item: {
    gap: moderateScale(9),
    width: Dimensions.get('window').width / 4.8,
    alignItems: 'center',
    marginVertical: moderateScale(8),
    marginLeft: moderateScale(5),
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: scale(12),
    backgroundColor: COLORS.itemBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(6),
    borderWidth: moderateScale(2),
    borderColor: 'transparent',
  },
  iconContainerSelected: {
    borderWidth: moderateScale(2),
    borderColor: COLORS.primary,
  },
  icon: {
    width: moderateScale(25),
    height: moderateScale(25),
    resizeMode: 'contain',
  },
  name: {
    fontFamily: 'Inria Sans',
    fontSize: moderateScale(12),
    fontWeight: '400',
    color: COLORS.darkText,
  },
  nameSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
