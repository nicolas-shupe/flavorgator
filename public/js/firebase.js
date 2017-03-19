// <script src="https://www.gstatic.com/firebasejs/3.7.2/firebase.js"></script>
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAasOds-5xi2RPUiy4tbB5hiLfdjlAdIqw",
  authDomain: "flavor-gator-95ca4.firebaseapp.com",
  databaseURL: "https://flavor-gator-95ca4.firebaseio.com",
  storageBucket: "flavor-gator-95ca4.appspot.com",
  messagingSenderId: "477854566477"
};
firebase.initializeApp(config);

const auth = firebase.auth();

var database = firebase.database();

function generateRandomString20() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!%^&*()?";
  var output = "";
  for (char = 0; char < 20; char++) {
    output += charset[Math.floor(Math.random()*charset.length)];
  }

  return output;
}

function register(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function signIn(email, password) {
  auth.signInWithEmailAndPassword(email, password).then(() => {
    const firebaseUser = auth.currentUser;

    database.ref('keys/' + generateRandomString20()).set({
      uid: firebaseUser.uid,
      date: new Date().toJSON()
    });
  }, e => {});
}