var firebase;

module.exports = {
	setModel: function(modelo){
		firebase = modelo;
  },
  login: function(req, res) {
  	// Get elements
    var txtEmail = req.body.txtEmail;
    var txtPassword = req.body.txtPassword;
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(txtEmail, txtPassword)
    	.then(function(data){
      	console.log(data);
      	res.redirect('/');
    	})
    	.catch(function(error) {
      	// Handle Errors.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("------------------------------");
        console.log(errorMessage);
        console.log("------------------------------");
        console.log(errorCode);
        console.log("------------------------------");
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
			    console.log('Contraseña invalida.');
			    res.redirect('/login');
			  } else if (errorCode === 'auth/user-not-found') {
			  	console.log('Usuario no encontrado.');
			  	res.redirect('/login');
			  } else if (errorCode === 'auth/invalid-email') {
			  	console.log('Correo invalido');
			  	res.redirect('/login');
			  } else {
			    console.log(errorMessage);
			  }
			  console.log(error);
			  // [END_EXCLUDE]
    	});
    // [END authwithemail]
  },
  authenticated: function (req, res) {
		firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var user = firebase.auth().currentUser;
        if(user != null){
          var email = user.email;
          console.log('Usuario encontrado: '+email);
          res.render('index', { data: email });
        } else {
          console.log('No se encontro un usuario');
          res.render('login');
        }
      } else {
        // No user is signed in.
        console.log('No se encontro un usuario');
        res.render('login');
      }
    });
  },
  prueba2: function (req, res) {
		firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log('Usuario encontrado: -------------------------');
        console.log('Email: '+email);
        res.render('index', { data: email });
      } else {
        // User is signed out.
        console.log('No se encontro un usuario');
        res.render('login');
      }
    });
  },
  logout: function(req, res){
  	firebase.auth().signOut();
  	res.redirect('/login');
  },
};



