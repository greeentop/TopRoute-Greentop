/*
 * SessionHandler - Requerido JQuery debido a que esta hecho como plugin de jquery y que es para ajax
 * Controla los request ajax de inicio y cierre de sessión.
 * Provee la abstracción y encapsulamiento de los request yvpermite a traves de callbacks tomar acciones personalizadas,
 * este plugin permite la reutilización de la funcionalidad del login y logout sin tener que reconfigurar la función ajax.
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * funcion startUserSession
 * 
 * -- parámetros --
 * action - string de la accion que realizará puese ser "login" o "logout" o "login-remote"
 * 
 * requestUrl - (opcional)sólo es útil cuando action es "login" y "login-remote", especifica la ruta donde se procesa la autenticación
 * 
 * resquestData - (opcional)sólo es útil cuando action es "login" y "login-remote", este parámetro es un objeto serializado que incluye los datos a envíar (credenciales), puede ser un form serializado o un json
 * 
 * redirectUrl - string de la url a la que será redirigido si concluye exitosamente, si se deja vacío no hará ninguna rediección
 * 
 * complete - (opcional) callback que se ejecuta cuando finaliza el proceso, el callback recibe como parámetro el json de respuesta
 * 
 * error - (opcional) callback que se ejecuta si ocurre un error, este callback indica que algo ocurriió y no se pudo completar el ajax request,
 * 		   el callback de error recibe como parámetros el xhr, status y error propios de $.ajax de jquery:
 * 				- xhr corresponde al Objeto jqXHR de JQuery que contiene el XMLHTTP response del request
 * 				- status es un string con el estado
 * 				- error es un string del error
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function($) {
	$.extend({		
		getLoggedUserApps: function(options){			
			var settings = $.extend({
				requestUrl: null,
				complete: null
			}, options);
			
			var ajaxRequest = JSON.stringify({
				code: 0,
				action: "getLoggedUserApps",
				data: [{}]
			});
			
			//proceso de carga de apps
			$.ajax({
				type : "POST",
				contentType: "application/json",
				url : settings.requestUrl,
				data: ajaxRequest, 
				dataType: "json",
				timeout : 100000,
				beforeSend: function (xhr) {
					xhr.withCredentials = true; //envía credenciales
		            xhr.setRequestHeader("X-Ajax-call", "true"); //header ajax
		        },
				success : function(response) {	
					if(response.code == 200){
						if(response.result[0].length>0){	
                            if(typeof settings.complete === 'function')
                                settings.complete(response.result[0]);
						}else{
                            if(typeof settings.complete === 'function')
                                settings.complete([]);
						} 
					}else{
                        if(typeof settings.complete === 'function')
                            settings.complete([]);
					}
				},
				error : function(xhr,status,error) {
                    if(typeof settings.complete === 'function')
                        settings.complete([]);
				}
			}); 
		},
        getLoggedUserMenus: function(options){			
			var settings = $.extend({
				requestUrl: null,
                appName: null,
				complete: null
			}, options);
			
			var ajaxRequest = JSON.stringify({
				code: 0,
				action: "getLoggedUserMenus",
				data: [settings.appName]
			});
			
			//proceso de carga de apps
			$.ajax({
				type : "POST",
				contentType: "application/json",
				url : settings.requestUrl,
				data: ajaxRequest, 
				dataType: "json",
				timeout : 100000,
				beforeSend: function (xhr) {
					xhr.withCredentials = true; //envía credenciales
		            xhr.setRequestHeader("X-Ajax-call", "true"); //header ajax
		        },
				success : function(response) {	
					if(response.code == 200){
						if(response.result[0].length>0){
                            if(typeof settings.complete === 'function')
                                settings.complete(response.result[0]);
						}else{
                            if(typeof settings.complete === 'function')
                                settings.complete([]);
						} 
					}else{
                        if(typeof settings.complete === 'function')
                            settings.complete([]);
					}
				},
				error : function(xhr,status,error) {
                    if(typeof settings.complete === 'function')
                        settings.complete([]);
				}
			}); 
		},
		getLoggedUser: function(options){
			var settings = $.extend({
				requestUrl: null,
				complete: null
			}, options);
			
			var ajaxRequest = JSON.stringify({
				code: 0,
				action: "getLoggedUserInfo",
				data: [{}]
			});
			
			//proceso de carga de la info
			$.ajax({
				type : "POST",
				contentType: "application/json",
				url : settings.requestUrl,
				data: ajaxRequest, 
				dataType: "json",
				timeout : 100000,
				beforeSend: function (xhr) {
					xhr.withCredentials = true; //envía credenciales
		            xhr.setRequestHeader("X-Ajax-call", "true"); //header ajax
		        },
				success : function(response) {	
					if(response.code == 200){
						if(response.result.length>0){	
                            if(typeof settings.complete === 'function')
                                settings.complete(response.result);
						}else{
                            if(typeof settings.complete === 'function')
                                settings.complete(null);
						} 
					}else{
                        if(typeof settings.complete === 'function')
                            settings.complete(null);
					}
				},
				error : function(xhr,status,error) {
                    if(typeof settings.complete === 'function')
                        settings.complete(null);
				}
			}); 			
		},
		
		refreshUserSession: function(options){
			var settings = $.extend({
				requestUrl: [],
                complete: null
			}, options);
						
			var urlLength = (settings.requestUrl != null) ? settings.requestUrl.length : 0;
			
			var ajaxRequest = JSON.stringify({
				code: 0,
				action: "refresh",
				data: [{}]
			});
            var finishC = 0;
            
            var finished = function(){
                if(finishC>=urlLength){
                    if(typeof settings.complete === 'function' )
                        settings.complete();
                }
            };
			
			if(urlLength > 0){
				for(var i = 0; i < urlLength; i++){
					if(settings.requestUrl[i].slice(-1)!='/')
						settings.requestUrl[i]+='/';
					//proceso de carga de apps
					$.ajax({
						type : "POST",
						contentType: "application/json",
						url : settings.requestUrl[i]+"security/refresh",
						data: ajaxRequest, 
						dataType: "json",
						timeout : 100000,
						beforeSend: function (xhr) {
							xhr.withCredentials = true; //envía credenciales
					        xhr.setRequestHeader("X-Ajax-call", "true"); //header ajax
					    },
						success : function(response) {	
							finishC++;
							finished();
						},
						error : function(xhr,status,error) {
                            finishC++;
							finished(); 
						}
					}); 		
				}
			}else{
                if(typeof settings.complete === 'function' )
                    settings.complete();
            }		
		},
		
		userSession: function(options) {
			var settings = $.extend({
				action: null,
				requestUrl: null,
				requestData: null,
				redirectUrl: null,
				complete: null,
				error: null
			}, options);
			
			var contentType ="", dataType ="";
			
			if ( settings.action && settings.action === "login-remote") {
				//ruta para hacer login en un contexto diferente el parámetro requestUrl es obligatorio				
				contentType = "application/x-www-form-urlencoded";
				dataType ="json";
			}
			
			if ( settings.action && settings.action === "login") {
				//ruta para hacer login configurada en springSecurity.xml (apartir de spring version 4.x.x por defecto es /login)
				settings.requestUrl ="/"+path+"/security/authenticate" ;
				contentType = "application/x-www-form-urlencoded";
				dataType ="json";
			}
			
			if ( settings.action && settings.action === "logout") {
				//ruta para hacer logout se hace manual en el controlador LoginAjaxController
				if(settings.requestUrl == null)
					settings.requestUrl = "/"+path+"/security/logout";
				settings.requestData = JSON.stringify({
					code: 0,
					action: "logout",
					data: [{}]
				});
				contentType = "application/json";
				dataType = "json";
			}
			
			//proceso de login
    		$.ajax({
    			type : "POST",
    			contentType: contentType,
    			url : settings.requestUrl,
    			data: settings.requestData, 
    			dataType: dataType,
    			timeout : 100000,
    			beforeSend: function (xhr) {
    				xhr.withCredentials = true; //envía credenciales
    	            xhr.setRequestHeader("X-Ajax-call", "true"); //header ajax
    	        },
    			success : function(response) {
    				
                    if (typeof settings.complete === 'function')
                        settings.complete(response);
    						
    				if(settings.redirectUrl && settings.redirectUrl != "")
    					window.location.replace(settings.redirectUrl);
    			},
    			error : function(xhr,status,error) {
    				if (typeof settings.error === 'function'){
    				    /*callback envía el xhr, status y error propios de $.ajax de jquery
    				    * xhr corresponde al Objeto jqXHR de JQuery que contiene el XMLHTTP response del request
    				    * status es un string con el estado
    					* error es un string del error
    					* */  
                        settings.error(xhr, status, error);   
    				}
    			}
    		});        	
    	}  
	});
 
}(jQuery));