/* Dependencies */
const VK = require('vk-io');
const express = require('express');
let router = express.Router();

/* If there is no bot config in directory */

try {
  const config = require('../../bot_config.json');
  
	/* Helper dependencies */
	const sha = require('../../helpers/sha.js');

	/* VK config */
	const vk = new VK({
		app : config.app,
		login : config.login,
		pass : config.password
	});

	/* VK auth */
	vk.auth.standalone().run().then((token) => {
			console.log('User token:', token);

			vk.setToken(token);
	}).catch((error) => {
			console.error(error);
	});

	/* Models */
	let Chat = require('../../models/chat.js');

	router.post('/get/all', (req, res) => {
		if(!req.body.offset && req.body.offset != 0) return res.json({ success : false, err : 'Invalid parameter(s)' });
		if(!req.body.limit && req.body.limit != 0) return res.json({ success : false, err : 'Invalid parameter(s)' });

		if(req.body.limit == -1){
			Chat.find().skip(req.body.offset).exec((err, chats) => {
				if(err){
					res.json({ success : false, err : err });
				} else {
					res.json({ success : true, response : { chats : chats }});
				}
			});
		} else {
			Chat.find().skip(req.body.offset).limit(req.body.limit).exec((err, chats) => {
				if(err){
					res.json({ success : false, err : err });
				} else {
					res.json({ success : true, response : { chats : chats }});
				}
			});
		}
	});

	router.post('/add', (req, res) => {
		if(!req.body.user) return res.json({ success : false, err : 'Invalid parameter(s)' });

		vk.api.friends.add({
			user_id : req.body.user
		}).then((result) => {
			res.json({ success : true, response : { status : result } });
		}).catch((error) => {
			res.json({ success : false, err : error.message });
		});
	});

	router.post('/formaturl', (req, res) => {
		if(!req.body.url) return res.json({ success : false, err : 'Invalid parameter(s)' });

		req.body.url = req.body.url.replace('http://','').replace('https://','').replace('m.vk.com/','').replace('vk.com/','').replace('/','').replace('www.','');

		vk.api.users.get({
			user_ids : req.body.url
		}).then((result) => {
			if(result.length > 0){
				res.json({ success : true, response : { vkid : result[0].id } });
			} else {
				res.json({ success : false, err : 'No such user' });
			}
		}).catch((error) => {
			console.log(error);
			res.json({ success : false, err : error.message });
		});
	});

	router.post('/friendship', (req, res) => {
		if(!req.body.user) return res.json({ success : false, err : 'Invalid parameter(s)' });

		vk.api.friends.areFriends({
			user_ids : [req.body.user]
		}).then((result) => {
			res.json({ success : true, response : { friendship : result[0].friend_status } });
		}).catch((error) => {
			res.json({ success : false, err : error.message });
		});
	});

	router.post('/join', (req, res) => {
		if(!req.body.user) return res.json({ success : false, err : 'Invalid parameter(s)' });
		if(!req.body.chat) return res.json({ success : false, err : 'Invalid parameter(s)' });

		vk.api.messages.addChatUser({
			chat_id : req.body.chat,
			user_id : req.body.user
		}).then((result) => {
			res.json({ success : true });
		}).catch((error) => {
			res.json({ success : false, err : error.message });
		});
	});

	router.post('/new', (req, res) => {
		if(!req.body.chat) return res.json({ success : false, err : 'Invalid parameter(s)' });
		if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

		let secret_hash = global.config.secret_hash;

		if(sha(req.body.secret) != secret_hash) return res.json({ success : false, err : 'Incorrect secret' });

		let chat = new Chat(req.body.chat);

		chat.save((err, newChat) => {
			if(err){
				res.json({ success : false, err : err });
			} else {
				res.json({ success : true, response : { chat : newChat }});
			}
		});
	});

	function updateChats(){
		vk.api.messages.getDialogs({
			count : 200
		}).then((result) => {
			let query = [];

			for(let i = 0; i < result.items.length; i++){
				if(result.items[i].message.chat_id && result.items[i].message.chat_active.length){
					let photo = null;

					for(let key in result.items[i].message){
						if(key.indexOf('photo') > -1) photo = result.items[i].message[key];
					}

					query.push({ chat : { $ne : result.items[i].message.chat_id } });

					updateOrCreate(result.items[i].message.chat_id, result.items[i].message.title, result.items[i].message.users_count, photo);
				}
			}

			if(query.length > 0){
				Chat.remove({ $and : query }, (err) => {
					if(err){
						console.log(err);
					}
				});
			}
		}).catch((error) => {
			console.log(error);
		});
	}

	function updateOrCreate(id, name, users, img){
		Chat.findOne({ chat : id }, (err, chat) => {
			if(err){
				console.log(err);
			} else if(chat){
				Chat.findOneAndUpdate({ chat : id }, { $set : { name : name, users : users, img : img }}, (err, chat) => {
					if(err){
						console.log(err);
					}
				});
			} else {
				let chat = new Chat({
					chat : id,
					name : name,
					users : users,
					img : img
				});

				chat.save((err, newChat) => {
					if(err){
						console.log(err);
					} else {
						console.log('New chat was added: ', { chat : id, name : name, users : users, img : img });
					}
				});
			}
		});
	}

	setInterval(updateChats, 10000);

	module.exports = router;
} catch (ex) {
  module.exports = router;
}