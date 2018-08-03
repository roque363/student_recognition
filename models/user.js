var firebase;
var admin;

module.exports = {
    setModel: function(modelo){
      firebase = modelo;
    },
    setAdmin: function(modelo){
      admin = modelo;
    },
    // Obtener los datos del usuario logeado
    showCurrentUser: function(req, res){
        var user = firebase.auth().currentUser;
        if(user != null){
            var userId = user.uid;
            var all, key, first_name, last_name, username, tipo;
            
            firebase.database().ref("users").child(userId).once('value').then(function(snapshot) {
                // Datos del usuario obtenido 
                key = snapshot.key;
                all =snapshot.val();
                first_name = snapshot.child("name").val();
                last_name = snapshot.child("last_name").val();
                username = snapshot.child("username").val();
                tipo = snapshot.child("tipo").val();
                console.log(all);
                console.log("Nombre del usuario: "+first_name);
                res.render('usuarios/profile',{ 
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    tipo: tipo
                });
            });
        } else {
            console.log('No se encontro un usuario');
            res.render('login');
        }
    },
    showall: function(req,res){
        var ref = firebase.database().ref('users');
        var all, key, first_name, last_name, username, tipo;
        var items = [];
    
        ref.on('value', function(snap){
            console.log(snap.key);
            snap.forEach(function(childSnapshot) {
                // childSnapshot will be the actual contents of the child
                key = childSnapshot.key;
                all = childSnapshot.val();
                first_name = childSnapshot.child("name").val();
                last_name = childSnapshot.child("last_name").val();
                username = childSnapshot.child("username").val();
                tipo = childSnapshot.child("tipo").val();
                items.push({
                    key: key,
                    first: first_name,
                    last: last_name,
                    user: username,
                    tipo: tipo
                });
                //console.log(items);
            });
            res.render('usuarios/table-profesor',{ 
                data: items
            });
        });
    },
    // Crea usuarios con permiso de administador
    create: function(req,res){
        var email = req.body.val_email;
        var password = req.body.val_password;
        var name_user = req.body.val_first_name;
        var last_name_user = req.body.val_last_name;
        var tipo_user = req.body.val_tipo;
        
        admin.auth().createUser({
          email: email,
          emailVerified: false,
          password: password,
          displayName: name_user+" "+last_name_user,
          disabled: false
        })
          .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            firebase.database().ref("users").child(userRecord.uid).set({ 
                name : name_user,
                last_name: last_name_user,
                username : email,
                tipo: tipo_user,
            }).catch(function(error) { 
                console.error(error); 
            });
            console.log("- Successfully created new user:", userRecord.uid);
            console.log(userRecord);
            res.redirect("/profesor_crear");
          })
          .catch(function(error) {
            console.log("Error creating new user:", error);
          });
    },
    // Obtener el ID de un usuario
    showOne: function(req,res){
        var all, userId, first_name, last_name, username, tipo;
        // Obtenemos el ID del usuario
        userId = req.query._id;
        console.log("- Id del usuario: "+userId);
            
        firebase.database().ref("users").child(userId).once('value')
            .then(function(snapshot) {
                // Datos del usuario obtenido 
                all =snapshot.val();
                first_name = snapshot.child("name").val();
                last_name = snapshot.child("last_name").val();
                username = snapshot.child("username").val();
                tipo = snapshot.child("tipo").val();
                console.log(all);
                //console.log("- Usuario encontrado: "+first_name);
                res.render('usuarios/edit-user',{ 
                    key: userId,
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    tipo: tipo
                });
            })
            .catch(function(error){
                console.log("- Error searching user:", error);
            });
    },
    update: function(req,res){
        var userId, first_name, last_name, username, tipo;
        // Obtenemos el ID del usuario
        userId = req.query._id;
        console.log("- Id del usuario: "+userId);
        
        // Obtenemos los datos del usuario
        username = req.body.val_email;
        first_name = req.body.val_first_name;
        last_name = req.body.val_last_name;
        tipo = req.body.val_tipo;
        
        admin.auth().updateUser(userId, {
          email: username,
          displayName: first_name+" "+last_name,
          disabled: false
        })
          .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            firebase.database().ref("users").child(userRecord.uid).set({ 
                name : first_name,
                last_name: last_name,
                username : username,
                tipo: tipo,
            }).catch(function(error) { 
                console.error("- Error: "+error); 
            });
            console.log("- Successfully update user:", userRecord.uid);
            //console.log(userRecord);
            res.redirect("/profesor_lista");
          })
          .catch(function(error) {
            console.log("Error updating user:", error);
          });
    },
    // Para que un usuario cree su propia cuenta  
    createByUser: function(req,res) {
        var email = req.body.val_email;
        var password = req.body.val_password;
        var name_user = req.body.val_first_name;
        var last_name_user = req.body.val_last_name;
        var tipo_user = req.body.val_tipo;
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(user){
                var usernew = firebase.auth().currentUser;
                var userId = usernew.uid;
                console.log(userId);
                console.log('everything went fine');
                
                firebase.database().ref("users").child(usernew.uid).set({ 
                    name : name_user,
                    last_name: last_name_user,
                    username : email,
                    tipo: tipo_user,
                }).catch(function(error) { 
                    console.error(error); 
                });
                console.log('user object:' + user);
                res.redirect("/");
            })
            .catch(function(error) {
                console.log('there was an error');
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode + ' - ' + errorMessage);
            });
    },
    delete: function(req,res){
        var userId = req.query._id;
        console.log(userId);
        admin.auth().deleteUser(userId)
            .then(function() {
                firebase.database().ref("users").child(userId).remove();
                console.log("Successfully deleted user");
                res.redirect('/profesor_lista');
            })
            .catch(function(error) {
                console.log("Error deleting user:", error);
            });
    }
};
