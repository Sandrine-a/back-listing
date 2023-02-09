const nodemailer = require("nodemailer");

module.exports = async (email, link) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.MAIL_SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });

    await transporter.sendMail({
      // from: `"Listing" <${process.env.MAIL_USER}>`,
      from: '"Listing" <noreply@listing.com>',
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Bonjour,</p>
      <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce courrier électronique.</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe dans les prochaines 5 minutes :</p>
      <p><a href="${link}">LIEN ICI</a></p>
      <p>Si vous avez des difficultés à cliquer sur le lien, veuillez copier et coller l'URL ci-dessus dans votre navigateur web.</p>
      <p>Si vous avez besoin d'aide supplémentaire, veuillez nous contacter.</p>
      <p>Cordialement,</p>
      <p>Listing Application</p>`,
      // text: `Bonjour,

      // Nous avons reçu une demande de réinitialisation de votre mot de passe. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce courrier électronique.

      // Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe dans les prochaines 5 minutes :

      // ${link}

      // Si vous avez des difficultés à cliquer sur le lien, veuillez copier et coller l'URL ci-dessus dans votre navigateur web.

      // Si vous avez besoin d'aide supplémentaire, veuillez nous contacter.

      // Cordialement,

      // Listing Application`,
    });

    // console.log("email ==", email);
    console.log("EMAIL ENVOYÉ AVEC SUCCES!!!!");
  } catch (error) {
    console.log(error, "EMAIL NOT SEND");
  }
};
