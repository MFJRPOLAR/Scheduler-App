import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  bottom: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 30,
  },
  header: {
    height: 30,
    marginLeft: 18,
    marginTop: 10,
  },
  footer: {
    height: 60,
    marginLeft: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;