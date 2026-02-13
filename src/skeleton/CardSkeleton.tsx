
import { View ,StyleSheet} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { moderateScale } from "react-native-size-matters";




const CardSkeleton = () => {
    return (
        <SkeletonPlaceholder
      backgroundColor="#e0e0e0"
      highlightColor="#fff"
      speed={1000}>
      <View style={styles.card}>
        <View style={{height:moderateScale(130),width:"100%"}}/> 
        <View style={{flex:1,marginTop:moderateScale(12),alignItems:"center", justifyContent:"space-between",flexDirection:'row'}}>
            <View style={{width:moderateScale(100),height:moderateScale(20)}}/>
            <View style={{width:moderateScale(100),height:moderateScale(20)}}/>
        </View>
        <View style={{width:"40%",height:moderateScale(40),marginTop:moderateScale(12)}}/>
      </View>
    </SkeletonPlaceholder>
    );
};

export default CardSkeleton;


const styles = StyleSheet.create({
    card:{
     width: '100%',
     height:moderateScale(250),
    alignSelf: 'center',
    padding: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    },
    title:{
        borderRadius: 4,
    width: 130,
    height: 10,
    marginTop: 5,
    }
})