const { Client, MessageMedia,LegacySessionAuth,LocalAuth,NoAuth,RemoteAuth   } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
const fse = require('fs-extra')
const { readdir } = require("fs/promises");
const md5 = require('md5');
const { phoneNumberFormatter } = require('./helpers/formatter');
const axios = require('axios');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const path =require ('path')
const moment = require('moment')
const stream = require('stream');
const crypto = require("crypto");
const date = require('date-and-time')
const multer = require('multer');
const upload = multer({dest:'./upload/'});
const SESSION_FILE_PATH = './wtf-session.json';
let sessionCfg;
let LoginWA=false
const myCustomId = 'wabro'

if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
};

var today  = new Date();
var now = today.toLocaleString();

const authStrategy =new LocalAuth({ clientId: myCustomId })
//const authStrategy =new LegacySessionAuth({session: sessionCfg})
const client = new Client({
	authStrategy: authStrategy,
	restartOnAuthFail: true,
	takeoverOnConflict: true,
	takeoverTimeoutMs: 10,
	puppeteer: {
		headless: true,
		args: [
		  '--no-sandbox',
		  '--disable-setuid-sandbox',
		  '--disable-dev-shm-usage',
		  '--disable-accelerated-2d-canvas',
		  '--no-first-run',
		  '--no-zygote',
		  '--single-process', // <- this one doesn't works in Windows
		  '--disable-gpu'
		],
	  },
	
});
 
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use("/assets", express.static(__dirname + "/client/assets"))

app.get("/", (req, res) => {
	res.sendFile("./client/server.html", {
		root: __dirname
	})
})

app.get("/client", (req, res) => {
	res.sendFile("./client/index.html", {
		root: __dirname
	})
})

// initialize whatsapp and the example event
client.initialize()
   .then(async () => {
      const version = await client.getWWebVersion()
      console.log(`WHATSAPP WEB version: v${version}`)
   })
   .catch((err) => {
      console.error(err)   
   })

io.on('connection', (socket) => {
  //console.log(socket)
  socket.emit('message', `${now} Connected`);

  client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit('message', `${now} QR Code received`);
    });
  });

  client.on('ready', () => {	
    console.log('ready client')
    socket.emit('message', `${now} WhatsApp is ready!`);
  });
	
  client.on('authenticated', (session) => {
	//console.log(client)
	LoginWA=true
	console.log('Server WA',LoginWA)
	var usrwa=''
	socket.emit('authenticated', `${now}=> ${usrwa}, authenticated`);
	if (!session==undefined){
		sessionCfg = session;
		fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
		  if (err) {
			console.error(err);
		  }
		});
	}
  });

  client.on('auth_failure', function(session) {
	LoginWA=false
    socket.emit('message', `${now} Auth failure, restarting...`);
  });
  client.on('connected', function(dt) {
    console.log('connected',dt)
  });
 
  client.on('message_create', (msg) => {
		// Fired on all message creations, including your own
		if (msg.fromMe) {
			// do stuff here
		}
	});

	client.on('message_revoke_everyone', async (after, before) => {
		// Fired whenever a message is deleted by anyone (including you)
		console.log(after); // message after it was deleted.
		if (before) {
			console.log(before); // message before it was deleted.
		}
	});

	client.on('message_revoke_me', async (msg) => {
		// Fired whenever a message is only deleted in your own view.
		//console.log(msg.body); // message before it was deleted.
	});

	client.on('message_ack', (msg, ack) => {
		/*
			== ACK VALUES ==
			ACK_ERROR: -1
			ACK_PENDING: 0
			ACK_SERVER: 1
			ACK_DEVICE: 2
			ACK_READ: 3
			ACK_PLAYED: 4
		*/

		if(ack == 3) {
			// The message was read
		}
	});

	client.on('group_join', (notification) => {
		// User has joined or been added to the group.
		//console.log('join', notification);
		//notification.reply('User joined.');
	});

	client.on('group_leave', (notification) => {
		// User has left or been kicked from the group.
		//console.log('leave', notification);
		//notification.reply('User left.');
	});

	client.on('group_update', (notification) => {
		// Group picture, subject or description has been updated.
		//console.log('update', notification);
	});

	client.on('change_state', state => {
		console.log('CHANGE STATE', state );
	});

	client.on('disconnected', (reason) => {
		LoginWA=false
		try{
			console.log('Client was logged out', reason);
		} catch(e){}
	});
  
});
app.post('/send-message', async (req, res) => {
  try{
	  const message = req.body.message
	  const number = req.body.number
	  var mobile_no = number;
	  var sanitized_number = mobile_no.replace(/[^\d]/g, ''); // remove except number
	  var phone=''
	  //LoginWA=true
	  if (LoginWA){
			if (sanitized_number.startsWith('0')) {
				sanitized_number = '62' + sanitized_number.substr(1);
			}

			if (!sanitized_number.endsWith('@c.us')) {
				sanitized_number += '@c.us';
				phone=sanitized_number
			}

			try{
				var number_details = await client.getNumberId(req.body.number);
			} catch(e){
				
			}
			if(number_details) {
				//console.log("Sending message to ", number_details);
				//console.log('phone', phone)	
				//console.log('client',client.info.pushname)
				if (client.info.pushname){
					client.sendMessage(phone, message)
						.then(response => {
						  return res.status(200).json({
							error: false,
							data: {
							  message: 'Pesan terkirim',
							  meta: response,
							},
						  });
						  
						})
						.catch(error => {
						  return res.status(200).json({
							error: true,
							data: {
							  message: 'Error send message'+error,
							  meta: {},
							},
						  });
						  
					});
				} else {
					return res.status(200).json({
						error: true,
						data: {
						  message: `Session ${number} tidak ditemukan !`,
						  meta: {},
						},
					  });
				}
			} else {
			  console.log(req.body.number, "Mobile no is not registered on Whatsapp")
			  //return false
			}	
		} else {
			return res.status(200).json({
					error: true,
					data: {
					  message: `Session ${number} tidak ditemukan !`,
					  meta: {},
					},
				  });
		}
  } catch(e){
	  console.log('Terjadi error =>',e)
  }
})

server.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`)
    console.log(`Aplikasi Client di http://localhost:${port}/client`)
})
