import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAVvp6QKYe1qYTQv1DIwtXcV2wnD6z2l4I',
  authDomain: 'catch-of-the-day-rale.firebaseapp.com',
  databaseURL: 'https://catch-of-the-day-rale.firebaseio.com',
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
