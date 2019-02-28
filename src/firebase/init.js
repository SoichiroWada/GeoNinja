import firebase from 'firebase'
import firestore from 'firebase/firestore'
  // Initialize Firebase
var config = {
apiKey: "AIzaSyCruQkOWthWmWlvvVRe4lChDGBzYA_Vfo4",
authDomain: "geo-ninja-3efcf.firebaseapp.com",
databaseURL: "https://geo-ninja-3efcf.firebaseio.com",
projectId: "geo-ninja-3efcf",
storageBucket: "geo-ninja-3efcf.appspot.com",
messagingSenderId: "10708376252"
};

const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true })

export default firebaseApp.firestore()