const path = require('path');

module.exports = {
  mode:'development',
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'vue.js', 
  },
  devServer:{
    port:8080,
    static:{directory:path.resolve(__dirname,'www')},
    open:true
  }
}