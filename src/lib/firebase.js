// Currently using firebase v9 with compatible packages
// TODO: Upgrade Fireabse fully to V9 as lib/firebase was 
// written for Firebase V8
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { firebaseConfig } from '../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
