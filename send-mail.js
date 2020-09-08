/*** code to send INC mail **/  
var nodemailer = require('nodemailer');

let smtpConfig = {
    host: 'smtp.gmail.com', // you can also use smtp.gmail.com
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'servicenow.jarvis@gmail.com', 
        pass: '********'
    }
};

function main(params) {
    return new Promise(function (resolve, reject) {
        let response = {
            code: 200,
            msg: 'E-mail was sent successfully!'
        };

        if (!params.snow_ticket_option) {
            response.msg = "Error: snow_ticket_option was not provided.";
            response.code = 400;
        }
        else if (!params.email) {
            response.msg = "Error: Destination e-mail was not provided.";
            response.code = 400;
        }
        else if (!params.conversation_id) {
            response.msg = "Error: Conversation id was not provided.";
            response.code = 400;
        }

        if (response.code != 200) {
            reject(response);
        }

        console.log(`Validation was successful, preparing to send email...`);

        sendEmail(params, function (email_response) {
            response.msg = email_response['msg'];
            response.code = email_response['code'];
            response.reason = email_response['reason'];
            console.log(`Email delivery response: (${email_response['code']}) ${response.msg}`);
            resolve(response);
        });

    });
}

function sendEmail(params, callback) {

    let transporter = nodemailer.createTransport(smtpConfig);
    let mailOptions = {
        from: 'JARVIS <${smtpConfig.auth.user}>',
        to: 'SUPPORT '+params.team_email_id,
        cc: params.email,
        subject: params.snow_ticket_option + ' | INC' + Math.floor(Math.random() * 10000000000),
        text:'INC raised for ' + params.snow_ticket_option + '\nDESCRIPTION :'+params.issue_description+ '\nAn incident has been opened on your behalf. An incident has been assigned to ' + params.team_email_id,
    };
    transporter.sendMail(mailOptions, function (error, info) {

        let email_response = {
            code: 200,
            msg: 'Email was sent successfully',
            reason: 'Success'
        };

        if (error) {
            email_response.msg = 'Error';
            email_response.code = 500;
            email_response.reason = error;
        }
        else {
            email_response.msg = info.response;
            email_response.code = 200;
            email_response.reason = info.response;
        }
        callback(email_response);
    });
}
