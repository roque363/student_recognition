var Chart = require('chart.js');
var firebase;

module.exports = {
    setModel: function(modelo){
      firebase = modelo;
    },
    showall: function(req,res){
        var ref = firebase.database().ref('users');
        var all;
        var keyUser, chart;
        var key, enfado, desprecio, asco, miedo, feliz, neutral, tristeza, sorpresa;
        var curso, fecha;
        var items = [];
        
        ref.on('value', function(snapshot){
            //console.log("Tabla 1: "+snapshot.key);
            snapshot.forEach(function(childSnapshot) {
                keyUser = childSnapshot.key;
                
                // childData will be the actual contents of the child
                childSnapshot.child("chart").forEach(function(childChildSnapshot){
                    // Table Chart
                    key = childChildSnapshot.key;
                    enfado = childChildSnapshot.child("anger").val();
                    desprecio = childChildSnapshot.child("contempt").val();
                    asco = childChildSnapshot.child("disgust").val();
                    miedo = childChildSnapshot.child("fear").val();
                    feliz = childChildSnapshot.child("happiness").val();
                    neutral = childChildSnapshot.child("neutral").val();
                    tristeza = childChildSnapshot.child("sadness").val();
                    sorpresa = childChildSnapshot.child("surprise").val();
                    curso = childChildSnapshot.child("curso").val();
                    fecha = childChildSnapshot.child("fecha").val();
                    items.push({
                        neutral: neutral,
                        miedo: miedo,
                        feliz: feliz,
                    });
                    //console.log(items);
                });
            });
        });
	    res.render('index',{ 
                data: items
            });
    },
    showEmotion: function(req,res){
        var ref = firebase.database().ref('users');
        var all;
        var keyUser, chart;
        var key, enfado, desprecio, asco, miedo, feliz, neutral, tristeza, sorpresa;
        var curso, fecha;
        var data = [];
        
        ref.on('value', function(snapshot){
            //console.log("Tabla 1: "+snapshot.key);
            snapshot.forEach(function(childSnapshot) {
                keyUser = childSnapshot.key;
                
                // childData will be the actual contents of the child
                childSnapshot.child("chart").forEach(function(childChildSnapshot){
                    // Table Chart
                    key = childChildSnapshot.key;
                    enfado = childChildSnapshot.child("anger").val();
                    desprecio = childChildSnapshot.child("contempt").val();
                    asco = childChildSnapshot.child("disgust").val();
                    miedo = childChildSnapshot.child("fear").val();
                    feliz = childChildSnapshot.child("happiness").val();
                    neutral = childChildSnapshot.child("neutral").val();
                    tristeza = childChildSnapshot.child("sadness").val();
                    sorpresa = childChildSnapshot.child("surprise").val();
                    curso = childChildSnapshot.child("curso").val();
                    fecha = childChildSnapshot.child("fecha").val();
                    data.push({
                        fecha: fecha,
                        enfado: enfado,
                        desprecio: desprecio,
                        asco: asco,
                        miedo: miedo,
                        feliz: feliz,
                        neutral: neutral,
                        tristeza: tristeza,
                        sorpresa: sorpresa
                    });
                });
            });
            console.log(data);
            res.send(data);
        });
    },
    showallEmotion: function(req,res){
        var ref = firebase.database().ref('users');
        var all;
        var keyUser, chart;
        var key, enfado, desprecio, asco, miedo, feliz, neutral, tristeza, sorpresa;
        var curso, fecha;
        var items = [];
        
        ref.on('value', function(snapshot){
            //console.log("Tabla 1: "+snapshot.key);
            snapshot.forEach(function(childSnapshot) {
                keyUser = childSnapshot.key;
                // childData will be the actual contents of the child
                // Table users
                childSnapshot.child("chart").forEach(function(childChildSnapshot){
                    // Table Chart
                    key = childChildSnapshot.key;
                    enfado = childChildSnapshot.child("anger").val();
                    desprecio = childChildSnapshot.child("contempt").val();
                    asco = childChildSnapshot.child("disgust").val();
                    miedo = childChildSnapshot.child("fear").val();
                    feliz = childChildSnapshot.child("happiness").val();
                    neutral = childChildSnapshot.child("neutral").val();
                    tristeza = childChildSnapshot.child("sadness").val();
                    sorpresa = childChildSnapshot.child("surprise").val();
                    curso = childChildSnapshot.child("curso").val();
                    fecha = childChildSnapshot.child("fecha").val();
                    items.push({
                        key: key,
                        enfado: enfado,
                        desprecio: desprecio,
                        asco: asco,
                        miedo: miedo,
                        feliz: feliz,
                        neutral: neutral,
                        tristeza: tristeza,
                        sorpresa: sorpresa,
                        curso: curso,
                        fecha: fecha
                    });
                });
            });
            res.render('table-emociones',{ 
                data: items
            });
        });
    },
};