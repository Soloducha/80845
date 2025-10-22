Entrega Final
se cambia la carga el array de muebles de un localStorage a un archivo json

para poder utilizar el archivo db.json como base de datos
Ejecutar json-server (en la raíz del proyecto donde esté db.json):

1. npm install -g json-server
2. json-server --watch db.json --port 3000

Dependiendo si el user es Admin o Cliente abre una pagina diferente:
El Admin puede hacer ABM de los muebles.
El Cliente solo comprar.

Si se ingresa como Administrador, se puede pasar al modo cliente, no viceversa.

puede haber codigo redundante entre cliente.js y admin.js

Leandro Soloducha
Comision 80845
