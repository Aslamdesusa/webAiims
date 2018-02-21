const db = require('../database').db;
const repairModel = require('../models/repairModel'); 
const userModel = require('../models/user');
const emailModel = require('../models/email');
const Joi = require('joi');
const jwt = require('jsonwebtoken')




const routes = [
	{
        method:'POST',
        path:'/auth',
        config:{
            //include this route in swagger documentation
            tags:['api'],
            description:"getting auth token",
            notes:"In this route we getting a token",
            validate:{
                payload:{
                    username:Joi.string(),
                    password:Joi.string()
                }
            }
        },
        handler: function(request, reply){
            userModel.find({'username': request.payload.username}, function(err, data){
                if (err){
                    reply({
                        'error': err
                    });
                } else if (data.length ==0){
                    reply({
                        'data': "user does not exist!"
                    });
                } else {
                    if (request.payload.password == data[0]['password']){
                        var username =request.payload.username;
                        const token = jwt.sign({
                            username,
                            userid:data[0]['_id'],
    
                        },'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy', {
                            algorithm: 'HS256',
                            expiresIn: '1h',
                        });
    
                         reply( {
                            token,
                            userid: data[0]['_id'],
                            data: "success"
                        } );
                    }
                }
            })

        }
    },
    {
        path: '/admin',
        method: 'POST',
        config: {
            tags: ['api'],
            description: 'Any person make a admin',
            notes: 'Any person make a admin',
            // we joi plugin to validate request
            validate:{
              payload:{
                    firstname:Joi.string().required(),
                    lastname:Joi.string(),
                    username:Joi.string().required(),
                    password:Joi.string().required(),
                    emailid:Joi.string().required(),
                    gender:Joi.string().required(),
                    contactNumber:Joi.number(),
                }
            }
        },
        handler: function(request, reply){
           userModel.find({}, function(err, data){
                console.log(data.length)

                if (data.length == 0){
                    var newUser = new userModel({
                       "firstname" : request.payload.firstname,
                       "lastname" : request.payload.lastname,
                       "username" : request.payload.username,
                       "password" : request.payload.password,
                       "emailid" : request.payload.emailid,
                       "gender" : request.payload.gender,
                       "createat":new Date(),
                       "contactNumber" : request.payload.contactNumber,
                   });

                   newUser.save(function(err, data){
                       if (err){
                        throw (err)
                           console.log(err);
                       } else{
                           reply({
                                statusCode: 200,
                                message: 'User created Successfully',
                                data: data
                            });
                       }
                   });
                } else {
                    reply({
                        'data': "There should be only one superuser and You can't signup"
            
                });
            }
        })
    } 
    },     
	{
		method: 'POST',
		path: '/complaint/submition/form',
		config:{
			tags:['api'],
            description:"Any User Can Post Complaint",
            notes:"In this route any user can post complaint",
            validate:{
            	payload:{
            		machineid:Joi.string().required(),
					phonenumber:Joi.number().required(),
					problemmsg:Joi.string().required(),
                    status:Joi.string().required()
            	}
            }
		},
		handler: function( request, reply ){
			var newModel = new repairModel({
				"machineid" : request.payload.machineid,
				"phonenumber": request.payload.phonenumber,
				"problemmsg" : request.payload.problemmsg,
                "status": request.payload.status,
				"createat" : new Date(),
			});
			newModel.save(function(err, data){
				if(err){
					throw err;
				}else{
					reply({
						StatusCode: 200,
						message: 'Your complaint for machine has been registered',
						data : data
					});
				}
			});
		}
	},
	{
		method: 'GET',
		path: '/get/all/complaint', 
		config:{
			tags:['api'],
            description:"Admin can get users complaint",
            notes:"In this route admin can get all complaints of users"
		},
		handler: function(request, reply){
			repairModel.find(function(err, data){
				if (err) {
					reply({
						StatusCode: 400,
						message: 'get complaint unsuccessfull',
						data : err
					});
				}else{
					reply({
						StatusCode: 200,
						message : 'find Successfully repair machine',
						data: data
					});
				}
			});
		}
	},
    {
        method: 'GET',
        path: '/get/all/emails', 
        config:{
            tags:['api'],
            description:"Admin can get  all emails",
            notes:"In this route Admin can get  all emails"
        },
        handler: function(request, reply){
            emailModel.find(function(err, data){
                if (err) {
                    reply({
                        StatusCode: 400,
                        message: 'getting email unsuccessfull',
                        data : err
                    });
                }else{
                    reply({
                        StatusCode: 200,
                        message : 'get all email Successfully',
                        data: data
                    });
                }
            });
        }
    },
	{
		method: 'DELETE',
		path: '/delete/specific/complaintById/{id}',
		config:{
			tags:['api'],
            description:"Admin can delete specific complaint of user",
            notes:"In this route admin can can delete specific complaint of user by complaint id",
			validate:{
				params:{
					id:Joi.string().required()
				}
			}
		},
		handler: function(request, reply){
			repairModel.findOneAndRemove({ _id: request.params.id }, function(err){
				if (err) {
					reply({
						StatusCode: 400,
						message: 'something went wrong....',
						data: err
					});
				}else{
					reply({
						StatusCode: 200,
						message: 'complaint deletec Successfully',
					});
				}
			});
		}
	},
    {
        method: 'DELETE',
        path: '/delete/specific/userById/{id}',
        config:{
            tags:['api'],
            description:"Admin can delete specific user of user",
            notes:"In this route admin can can delete specific user by user id",
            validate:{
                params:{
                    id:Joi.string().required()
                }
            }
        },
        handler: function(request, reply){
            userModel.findOneAndRemove({ _id: request.params.id }, function(err){
                if (err) {
                    reply({
                        StatusCode: 400,
                        message: 'something went wrong....',
                        data: err
                    });
                }else{
                    reply({
                        StatusCode: 200,
                        message: 'user deletec Successfully',
                    });
                }
            });
        }
    }, 
    {
        method: 'DELETE',
        path: '/delete/specific/emailById/{id}',
        config:{
            tags:['api'],
            description:"Admin can delete specific email",
            notes:"In this route admin can can delete specific email by id",
            validate:{
                params:{
                    id:Joi.string().required()
                }
            }
        },
        handler: function(request, reply){
            emailModel.findOneAndRemove({ _id: request.params.id }, function(err){
                if (err) {
                    reply({
                        StatusCode: 400,
                        message: 'something went wrong....',
                        data: err
                    });
                }else{
                    reply({
                        StatusCode: 200,
                        message: 'email deleted Successfully',
                    });
                }
            });
        }
    },    
	{
		method: 'PUT',
		path: '/update/specific/complaintById/{id}',
		config:{
			tags:['api'],
            description:"user can update his complaint",
            notes:"In this route user can update his complaint by complaint id",
			validate:{
				params:{
					id:Joi.string().required()
				},
				payload: {
					machineid:Joi.string().required(),
					phonenumber:Joi.number().required(),
					problemmsg:Joi.string().required(),
                    status:Joi.string().required()
				}
			}
		},
		handler: function(request, reply){
			repairModel.findOneAndUpdate({ _id: request.params.id }, request.payload, function (err, data){
				if (err) {
					reply({
						StatusCode: 503,
						data: err,
						message: 'Failed to update data',
					});
				}else{
					reply({
						StatusCode: 200,
						message: 'complaint Successfully updated',
						data: data
					});
				}
			});
		}
	},
	{
    	method: 'GET',
    	path: '/get/complaint/by/{id}',
    	config:{
			tags:['api'],
            description:"Admin can get specific complaint of users",
            notes:"In this route admin can get specific complaint of users by complaint id",
       		validate:{
				params:{
					id:Joi.string().required()
				}
			}
		},
    	handler: function(request, reply){
    		repairModel.find({"_id":request.params.id}, function(err, data){
    			// console.log('dslfkjlkds');
    			if (err) {
    				reply({
    					statusCode: 503,
    					message: 'no metch found',
    					data: err
    				});
    			}
    			else{
    				reply({
    					statusCode: 200,
    					message: "your complaint has been found results are here.",
    					data: data
    				});
    			}
    		});
    	}
    },
    {
        method: 'POST',
        path: '/post/email/address/by/super/admine',
        config:{
            tags:['api'],
            description:"only super admin can add email of any person",
            notes:"In this route super admin can add email of any person",
            validate:{
                payload:{
                    emailaddress:Joi.string().required(),
                    companyname:Joi.string().required()
                }
            }
        },
        handler: function(request, reply){
            var newEmail = new emailModel({
                "emailaddress": request.payload.emailaddress,
                "companyname" : request.payload.companyname,
                "createat" : new Date(),
            });
            newEmail.save(function(err, data){
               if (err){
                throw (err)
                   console.log(err);
               } else{
                   reply({
                        statusCode: 200,
                        message: 'email created Successfully',
                        data: data
                    });
               }
           });   
        }
    }
]
export default routes;