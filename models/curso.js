var firebase;
module.exports = {
    setModel: function(modelo){
        firebase = modelo;
    },
    showall: function(req, res){
        var ref = firebase.database().ref('aulas');
        var all;
        var key, year,aula,carrera,ciclo,horaF,horaI,nombre_curso,user_id;
        var items = [];
        
        ref.on('value', function(snap){
            console.log(snap.key);
            snap.forEach(function(childSnapshot) {
                key = childSnapshot.key;
                // childData will be the actual contents of the child
                all = childSnapshot.val();
                year = childSnapshot.child("anio").val();
                aula = childSnapshot.child("aula").val();
                carrera = childSnapshot.child("carrera").val();
                ciclo = childSnapshot.child("ciclo").val();
                horaF = childSnapshot.child("horaF").val();
                horaI = childSnapshot.child("horaI").val();
                nombre_curso = childSnapshot.child("nombre_curso").val();
                user_id = childSnapshot.child("user_id").val();
                items.push({
                    key: key,
                    year: year,
                    aula: aula,
                    carrera: carrera,
                    ciclo: ciclo,
                    horaF: horaF,
                    horaI: horaI,
                    nombre_curso: nombre_curso,
                    user_id: user_id
                });
                //console.log(items);
            });
            res.render('cursos/table-curso',{ 
                data: items
            });
        });
    },
    create: function(req, res){
        var usernew = firebase.auth().currentUser;
        var userId = usernew.uid;
        
        var year = req.body.val_year;
        var aula = req.body.val_aula;
        var carrera = req.body.val_carrera;
        var ciclo = req.body.val_ciclo;
        var horaF = req.body.val_fehaF;
        var horaI = req.body.val_fehaI;
        var nombre_curso = req.body.val_nombre;
        var user_id = userId;
         firebase.database().ref("aulas").child(usernew.uid).set({ 
                anio : year,
                aula: aula,
                carrera: carrera,
                ciclo: ciclo,
                horaF: horaF,
                horaI: horaI,
                nombre_curso: nombre_curso,
                user_id: user_id
            }).catch(function(error) { 
                console.error(error); 
            });
            res.redirect("/curso_lista");

    }
};