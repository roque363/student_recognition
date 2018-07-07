var firebase;
module.exports = {
    setModel: function(modelo){
      firebase = modelo;
    },
    show: function(req, res){
        var user = firebase.auth().currentUser;
        if(user != null){
            var userId = user.uid;
            var items = [];
            var key, first_name, last_name, username, tipo;
            
            firebase.database().ref("users").child(userId).once('value').then(function(snapshot) {
                key = snapshot.key;
                var all =snapshot.val();
                first_name = snapshot.child("name").val();
                last_name = snapshot.child("last_name").val();
                username = snapshot.child("username").val();
                tipo = snapshot.child("tipo").val();
                console.log(all);
                console.log(first_name);
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
        var all;
        var key, first_name, last_name, username, tipo;
        var items = [];
    
        ref.on('value', function(snap){
            console.log(snap.key);
            snap.forEach(function(childSnapshot) {
                key = childSnapshot.key;
                // childData will be the actual contents of the child
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
    create: function(req,res) {
        var ref = firebase.database().ref('users');
        var email = req.body.val_email;
        var password = req.body.val_password;
        var name_user = req.body.val_first_name;
        var last_name_user = req.body.val_last_name;
        var tipo_user = req.body.val_tipo;
        
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
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
        }).catch(function(error) {
            console.log('there was an error');
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ' - ' + errorMessage);
        });
    },
    delete: function(req,res){
        var _id = req.query._id;
        console.log(_id);
    }
};
