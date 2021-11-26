const nodemailer = require ('nodemailer');

async function enviarEmail ( usuario ) {
  const contaTeste = await nodemailer.createTestAccount();

  const transportador = nodemailer.createTransport( {
      host: 'smtp.ethereal.email',
      auth: contaTeste, 
    } );

    const info =  await transportador.sendMail( {
      from: '"Blog do Código "<noreply@blogdocodigo.com.br>',
      to: usuario.email,
      text: 'Olá este é um email de teste',
      html: '<h1> Olá </h1> <p>Este é um email de teste !</p>'
    } );

    //para recurperar o link do email teste
    console.log("URL : " + nodemailer.getTestMessageUrl(info)); 
}

module.exports = { enviarEmail };