import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  title: {
    borderRadius: 4,
    width: 130,
    height: 10,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  jobRow: {flexDirection: 'row', gap: 10, paddingVertical: 10},
  rowLeft: {
    marginTop:20,
    flexDirection: 'row',
    width: '45%',
    alignItems: 'center',
    gap: 10,
  },
  rowRight:{
     marginTop:20,
    width: '45%',
    gap: 10,
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 4,
  },
  line: {
    borderRadius: 4,
    width: 110,
    height: 10,
    marginTop: 5,
  },
  bottomRightButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  bottomLeftButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    gap: 15,
    paddingTop: 18,
  },
  smallLine: {
    borderRadius: 4,
    width: 50,
    height: 10,
    marginTop: 5,
  },
  fourthRow: {
    paddingTop: 10,
  },
  fourthRowRight: {
   
    justifyContent:'flex-end',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    gap: 10,
  },
  longBox: {
    width: 70,
    height: 30,
    borderRadius: 4,
  },
  smallBox: {
    borderRadius: 4,
    width: 30,
    height: 30,
  },
});

export default styles;
