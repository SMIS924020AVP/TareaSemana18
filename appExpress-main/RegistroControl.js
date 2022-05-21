const fs = require('fs')

const save = (usuarioNuevo) => {

fs.readFile ("usersData.js", (error, data) => {
    if (error) {throw error} 

    var cofre = data.toString();
    var FinalCorchete = 0
    for (let index = 0; index < cofre.length; index++) {
   // console.log (cofre[index])
     if (cofre[index]==="]") {
         FinalCorchete = index
         break
     }   
    
}
var InicioCiclo = cofre.slice(0,FinalCorchete-1)
var EscribirUsuario = InicioCiclo + usuarioNuevo + "];" + "module.exports= {data}"
fs.writeFile("usersData.js", EscribirUsuario, (error) => {
    if (error) {throw error}
})


})

}

module.exports= {save}