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

function tokenValid(token, expiration, onSuccess, onFailure=()=>{return false;}) {
  const parent = token + "/";
  token = getCookie(token);
  alert(token);
  if (token == null) {
    return onFailure();
  }

  ref = database.ref(parent + token);
  ref.once("value", function(snapshot) {
    const date = new Date(snapshot.val().date);
    const today = new Date();
    if (today - date > expiration) {
      ref.remove();
      return onFailure();
    }
    return onSuccess(token, expiration);
  });
}

function tokenUser(token, expiration, onSuccess, onFailure=()=>{return false;}) {
  const parent = token + "/";
  return tokenValid(token, expiration,
  function() {
    token = getCookie(token);
    ref = database.ref(parent + token);
    ref.once("value", function(snapshot) {
      const uid = snapshot.val().uid;
      onSuccess(uid, token, expiration);
    });
  },
  onFailure());
}

tokenValid("rememberMe", 14*24*60*60*1000,
function (token) {
  alert(token);
},
function () {
  alert("");
});

function generateToken(tokenType, parent, expiration, firebaseUser) {
  var token = getCookie(tokenType);
  parent = tokenType + "/";
  tokenValid(token, expiration,
  function () {
    alert("valid");
  },
  function () {
    alert("new");
    token = generateRandomString50();
    var ref = database.ref(parent + token);
    ref.once("value", function(snapshot) {
      if (!snapshot.exists()) {
        alert(token);
        setCookieDate(tokenType, token, expiration);
        database.ref(parent + token).set({
          uid: firebaseUser.uid,
          date: new Date().toUTCString()
        }).then(()=>alert("success!"),()=>alert("failure"));
      }
      else {
        generateToken(tokenType, parent, expiration, firebaseUser);
      }
    });
  });
}

function signIn(email, password) {
  auth.signInWithEmailAndPassword(email, password).then(() => {
    const firebaseUser = auth.currentUser;

    generateToken("rememberMe", 14*24*60*60*1000, firebaseUser);  
  }, e => {
    alert("no");
  });
}

function register(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function loginForm(form) {
  const email = form.email.value;
  const password = form.password.value;

  signIn(email, password);
}