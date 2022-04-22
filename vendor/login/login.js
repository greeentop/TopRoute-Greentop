var path = "PortalVendor";
//inicializa FastClick (reduce el delay entre la acción y el evento de click) - https://ftlabs.github.io/fastclick/
/*window.addEventListener('load', function () {
 new FastClick(document.body);
 }, false);*/

//validamos si tiene soporte para touch, si no tiene agrgamos al body la clase non-touch para habilitar efectos hover
var touchsupport = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
if (!touchsupport) { // navegador no tiene soporte para touch
    $("body").addClass(" non-touch");
}

//remueve el loading screen en la carga de la página
//$(window).load(function () {
$(window).load(function () {
 $(".loading-screen-layer").fadeToggle(200);
 });

//inicializa los tooltips que se habiliten en hover
$('body.non-touch').tooltip({
    selector: '[data-toggle="tooltip"]',
    trigger: 'hover'
});

//inicializa los efectos waves para botones ( similar a materialize  - http://fian.my.id/Waves )
/*Waves.attach('.btn-light-wave', ['waves-float']);
 Waves.attach('.btn-dark-wave', ['waves-float', 'waves-light']);
 Waves.init();*/

//función que anima un elemento 
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

//controlamos la navegación del menu cuando se hace click en alguna sección del menu se hace scroll al contenido respectivo
$(document).on("click", "a[href^='#']", function (e) {
    var href = $(this).attr("href"), target = $(href).parents(".mCustomScrollbar");
    if (target.length) {
        e.preventDefault();
        var target_pos_y = $(href).offset().top;

        var pos_y = (($("#top-page").offset().top * -1) + target_pos_y);

        if (href == "#top-page")
            pos_y = 0;
        else if (href == "#news-content")
            pos_y -= ($(window).width() <= 767) ? -10 : 36;
        else
            pos_y -= ($(window).width() <= 767) ? 0 : 42;

        target.mCustomScrollbar("scrollTo", pos_y, {
            scrollInertia: 800,
            scrollEasing: "linear"
        });
    }
    //hacemos refresh la sesión en las aplicaciones del usuario
    $.refreshUserSession({
        requestUrl: LOGGED_USER_APPS
    });
});

//variables globales
var LOGGED_USER_APPS = [];  //url's de aplicaciones del usuario autenticado 
var OLD_WHIDTH_GLOBAL = 1025; //almacena el ancho de la página antes del resize, el ancho por defecto es el ancho minimo en el que se activa el collapse de la barra de navegación
var ALREADY_POST = false; //indica si ya se hizo post

//valida el espacio disponible y en función de ello remueve/añade características 
function validate_width() {
    if ($(window).width() <= 1024) {
        if (OLD_WHIDTH_GLOBAL > 1024) {
            if ($("#btn-toggle-bar").hasClass('active')) {
                hide_side_bar();
                $(".dark-overlay-layer").hide();
                disable_scroll_left_bar();
            }
        }
    } else {
        $(".dark-overlay-layer").hide();
        if ($("#btn-toggle-bar").hasClass('active')) {
            show_side_bar();
            enable_scroll_left_bar();
        }
    }

    OLD_WHIDTH_GLOBAL = $(window).width();
}


/*** FUNCIONES DE LA NAVEGACION ***/



//valida en que sección estas del menu de navegación basado en la posición del scroll
function validate_navbar_selected_menu_item() {
    var pos_y = ($(window).width() <= 767) ? 75 : 65;
    var page_y = $("#top-page").offset().top;
    var about_y = $("#about-info").offset().top;
    var presence_y = $("#presence-info").offset().top;
    var news_y = $("#news-content").offset().top;

    if (pos_y > page_y) {
        if (!$("#welcome-item").hasClass("active")) {
            $("#navbar").find("li").removeClass("active");
            $("#welcome-item").addClass("active");
        }
    }

    if (pos_y > about_y) {
        if (!$("#about-item").hasClass("active")) {
            $("#navbar").find("li").removeClass("active");
            $("#about-item").addClass("active");
        }
    }

    if (pos_y > presence_y) {
        if (!$("#presence-item").hasClass("active")) {
            $("#navbar").find("li").removeClass("active");
            $("#presence-item").addClass("active");
        }
    }

    if (pos_y > news_y) {
        if (!$("#news-item").hasClass("active")) {
            $("#navbar").find("li").removeClass("active");
            $("#news-item").addClass("active");
        }
    }

}

//muestra navegación de usuario sin accesos
function show_nav_login() {

    $("#card-info-nombreUsuario").text('undefined');
    $("#card-info-nombre").text('undefined');
    $("#card-info-email").text('undefined');

    $("#logged-item").removeClass('visible-item');
    $("#logged-item").addClass('hidden-item');
    $("#app-list-menu").removeClass('visible-item');
    $("#app-list-menu").addClass('hidden-item');
    /*$("#app-item").removeClass('visible-item'); 
     $("#app-item") .addClass('hidden-item');*/
    $("#login-item").removeClass('hidden-item');
    $("#login-item").addClass('visible-item');

}

//muestra navegación de usuario logeado
function show_nav_logged(userData) {
    var usuario = userData[0];
    var isAdmin = userData[1];
    $("#card-info-nombreUsuario").text(usuario.userName);
    $("#card-info-nombre").text(((usuario.name) ? usuario.name : '----') + ' ' + ((usuario.middleName) ? usuario.middleName : '') + ' ' + ((usuario.lastName) ? usuario.lastName : ''));
    $("#card-info-email").text((usuario.email != null) ? usuario.email : '----');

    if (isAdmin) {
        $("#btn-do-config").removeClass('hidden-item');
        $("#btn-do-config").addClass('visible-item');
    } else {
        $("#btn-do-config").removeClass('visible-item');
        $("#btn-do-config").addClass('hidden-item');
    }

    $("#login-item").removeClass('visible-item');
    $("#login-item").addClass('hidden-item');
    $("#logged-item").removeClass('hidden-item');
    $("#logged-item").addClass('visible-item');
    $("#app-list-menu").removeClass('hidden-item');
    $("#app-list-menu").addClass('visible-item');
    /*$("#app-item").removeClass('hidden-item'); 
     $("#app-item") .addClass('visible-item');*/
}

/*** FUNCIONES DE LA NAVEGACION ***/

/*** FUNCIONES PARA LOGIN  ***/

function logoutOfApp(url, isDone, onFail) {

    if (url.slice(-1) != '/')
        url += '/';
    url += "security/logout";

    $.userSession({
        requestUrl: url,
        action: 'logout', //se realizará el login
        complete: function (response) {
            console.log("SUCCESS: ", response.message);
            if (response.code == 200) {
                if (response.result.length > 0) { //verifíco que la longitud de la respuesta sea diferente de cero para descartar error interno
                    isDone();
                } else {
                    onFail();
                }
            } else {
                onFail();
                console.log("ERROR: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            onFail();
            console.log(error);
        }
    });
}

// por ajax envía solicitud para cerrar sesión
function cerrar_sesion() {
    $(".loading-screen-layer").fadeToggle(200);
    var done = 0;
    var fail = 0;
    var isDone = function () {
        if (done >= LOGGED_USER_APPS.length) {
            show_nav_login();
            disable_scroll_left_bar();
            hide_side_bar();
            if ($(window).width() <= 767)
                $('.navbar-toggle').click();

            $(".loading-screen-layer").fadeToggle(200, function () {
                if (fail > 0) {
                    $("#modal-info").showMessageInfo({
                        title: $('#txt_login_finalized').val(),
                        message: $('#txt_login_errorClossSesion').val(),
                        type: InfoMessageType.WARNING
                    });
                }
            });

        }
    };
    /** IMPORTANTE El plugin JQuery userSession es propio del desarrollo
     *  para más detalles del plugin ir al archivo del proyecto:
     *  /src/main/webapp/resources/js/jsFunctions/UserSessionUtils.js
     *  ahi estan las rutas de login y logout
     **/
    $.each(LOGGED_USER_APPS, function (index, url) {
        logoutOfApp(url, function () {
            done++;
            isDone();
        },
                function () {
                    done++;
                    fail++;
                    isDone();
                }
        );
    });



}

function validUser(user, callback, passwordEmptycallback, userInvalidCallback, error_callback) {
    $.ajax({
        url: "/"+path + '/raiz/validarUser?user=' + user,
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: function (respAjax) {
            if (respAjax.code == "200") {
                //PROCEDURE VALID_USER ( P_USER IN VARCHAR2, SALIDA OUT VARCHAR2, SALIDA_EXIST OUT INTEGER, SALIDA_PASS OUT INTEGER, SALIDA_EMAIL OUT VARCHAR2)
                if (respAjax.result[0].SALIDA == 'OK') {
                    if (respAjax.result[0].SALIDA_EXIST) {          // USUARIO EXISTENTE
                        if (respAjax.result[0].SALIDA_PASS) {        // SI CONTIENE PASSWORD
                            callback();
                        } else {
                            passwordEmptycallback(respAjax.result[0].SALIDA_EMAIL);
                        }
                    } else {
                        userInvalidCallback();
                    }
                }else {
                    error_callback();
                }
            }
        },
        error: error_callback
    });
}
/*function ResetPass(user, pass, email, callback, callback_, error_callback) {
    $.ajax({
        url: "/"+path + '/raiz/ResetPass?user=' + user + '&pass=' + pass + '&email=' + email,
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: function (respAjax) {
            if (respAjax.code == "200") {
                if (respAjax.result[0]) {
                    console.log("PASS UPDATE AND LOGIN: ");
                    callback();
                } else {
                    console.log("PASS EXISTENTE: ");
                    callback_();
                }
            } else {

            }
        },
        error: error_callback
    });
}*/

function ir_Inicio(callback, error_callback) {
    window.location.href = "/"+path;
}

/*function new_pass_usuario() {
    if ($('#username').val().trim() != '' && $('#password').val().trim() != '' && $('#password_repit').val().trim() != '' && !ALREADY_POST) {
        ALREADY_POST = true;
        $(".loading-screen-layer").fadeToggle(200);
        $("#login-form-error").css("display", "none");
        if ($('#password').val().trim() === $('#password_repit').val().trim()) {
            ResetPass($('#username').val(), $('#password').val(), $('#email').val(),
                    function () {
                        window.location.replace("/"+path);///loginUser
                    },
                    function () {
                        $(".loading-screen-layer").fadeToggle(200);
                    });
        } else {
            $("#login-form-error").text($('#txt_login_passwordDiferent').val());
            $("#login-form-error").css("display", "block");
            $(".loading-screen-layer").fadeToggle(200);
            ALREADY_POST = false;
        }
    } else {
        $("#login-form-error").text($('#txt_login_emptyInputs').val());
        $("#login-form-error").css("display", "block");
    }
}*/
// por ajax envía los datos para autenticar el usuario
function autenticar_usuario() {
    if ($('#username').val().trim() != '' && $('#password').val().trim() != '' && !ALREADY_POST) {
        ALREADY_POST = true;
        $(".loading-screen-layer").fadeToggle(200);
        $("#login-form-error").css("display", "none");

        /** IMPORTANTE El plugin JQuery userSession es propio del desarrollo
         *  para más detalles del plugin ir al archivo del proyecto:
         *  /src/main/webapp/resources/js/jsFunctions/userSessionHandler.js
         *  ahi estan las rutas de login y logout
         **/
        validUser($('#username').val(), loginUser, function (email_) {
            $("#btn-do-login").hide();
            $("#login-form-layer").css("height", "485px");
            $("#login-form-layer").css("margin-top", " -250px");
            $("#btn-do-new-pass").show();
            $("#password_repit").parent().show();
            $("#email").parent().show();
            $("#email").val(email_);
            $("#password").val("");
            $("#username").prop('disabled', true);
            $("#email").prop('disabled', true);
            $("#login-form-info").text($('#txt_login_msjNewPassWord').val());
            $("#login-form-info").css("display", "block");
            $("#accesoUser").css("display", "none");
            $(".loading-screen-layer").fadeToggle(200);
            ALREADY_POST = false;
        }, function(){
            $("#login-form-error").text($('#txt_login_validarCredenciales').val());
            $("#login-form-error").css("display", "block");
            $(".loading-screen-layer").fadeToggle(200);
            ALREADY_POST = false;
        }, function(){
            $("#login-form-error").text($('#txt_login_errorInterno').val());
            $("#login-form-error").css("display", "block");
            $(".loading-screen-layer").fadeToggle(200);
            ALREADY_POST = false;
        });
    } else {
        $("#login-form-error").text($('#txt_login_emptyInputs').val());
        $("#login-form-error").css("display", "block");
        ALREADY_POST = false;
    }
}

function loginUser() {
    var data = $('#login-form input').serialize(); //serializa la información dentro de los inputs del formulario

    $.userSession({
        action: 'login', //se realizará el login
        requestData: data,
        complete: function (response) {
            console.log("SUCCESS: ", response);

            if (response.code == 200) { //si el código de nuestra respuesta es 200 quiere decir que el proceso se realizó correctamente				
                if (response.result.length > 0) { //si se autenticó tiene en resultado algo
                    $("#username").val("");
                    $("#password").val("");

                    ir_Inicio();
                } else { //si no se autenticó el resultado esta vacío (esto se dispara correctamente en otros disparan el callback de error)
                    $(".loading-screen-layer").fadeToggle(200, function () {
                        $("#login-form-error").text(response.message);
                        $("#login-form-error").css("display", "block");
                    });
                }
            } else {
                $(".loading-screen-layer").fadeToggle(200, function () {
                    console.log("ERROR: " + response.message);
                    $("#login-form-error").text(response.message);
                    $("#login-form-error").css("display", "block");
                });
            }
            ALREADY_POST = false;
        },
        error: function (xhr, status, error) {
            console.log("ERROR: ", xhr);
            $("#login-form-error").text($('#txt_login_errorInterno').val());
            $("#login-form-error").css("display", "block");
            $(".loading-screen-layer").fadeToggle(200);
            ALREADY_POST = false;
        }
    });
}
//verifica si ya se concluyeron los intentos de login en las apps remotas
function is_done_login(doneProcess, failProcess, totalProcess, userData) {
    console.log(doneProcess + " done of " + totalProcess + " - failed " + failProcess);
    if (doneProcess >= totalProcess) {
        if (failProcess > 0) {
            $(".loading-screen-layer").fadeToggle(200, function () {
                console.log("ERROR: no se puede autenticar en aplicación remota");
                /*$("#login-form-error").text("Error del lado del servidor al intentar autenticarse en algunas aplicaciones.");
                 $("#login-form-error").css("display", "block");
                 cerrar_sesion();*/
                /*mostrar_main_home();
                 show_nav_logged(userData);*/
                //irAMenu();
            });
        } else {
            $(".loading-screen-layer").fadeToggle(200, function () {
                /*mostrar_main_home();
                 show_nav_logged(userData);*/
            });
            //irAMenu();
        }
    }
}

/* hace el login en las aplicaciones que tiene asignadas el usuario
 * urls - es la coleccion de url de las aplicaciones que utilizan la sessión global
 * data - las credenciales ya serializadas para hacer login
 * user - el objeto usuario que se recibe en el reponse de ajax
 */
function remote_app_login(urls, data, userData) {

    var appsLength = urls.length;
    var doneProcess = 0, failProcess = 0;
    if (appsLength > 0) {
        for (var i = 0; i < appsLength; i++) {
            if (urls[i].slice(-1) != '/')
                urls[i] += '/';
            //if (urls[i].enabled && urls[i].sessionIntegrated && urls[i].name != "SPE"){
            $.userSession({
                action: 'login-remote', //se realizará el login en app remota
                requestUrl: urls[i] + "security/authenticate",
                requestData: data,
                complete: function (response) {
                    console.log("SUCCESS: ", response);
                    doneProcess++;
                    is_done_login(doneProcess, failProcess, appsLength, userData);
                },
                error: function (xhr, status, error) {
                    console.log("ERROR: ", xhr);
                    /*console.log("ERROR: ", status);
                     console.log("ERROR: ", error);*/
                    doneProcess++;
                    failProcess++;
                    is_done_login(doneProcess, failProcess, appsLength, userData);
                }
            });
            // }
        }
    } else {
        is_done_login(0, 0, 0, userData);
    }

}

/*** FUNCIONES PARA LOGIN  ***/

/*** FUNCIONES PARA SIDE BAR ***/

//muestra el sidebar
function show_side_bar() {
    $("#btn-toggle-bar").addClass('active');
    $("#main-home-right").removeClass('sm-active');
    $("#main-navigation").removeClass('sm-active');
    $("#main-home-left").removeClass('sm-active');
    if ($(window).width() <= 767 && $('#navbar').hasClass('in'))//valida si esta en móvil y cierra el menu de navegación si se dejo abierto
        $('.navbar-toggle').click();
}

//oculta el sidebar
function hide_side_bar() {
    $("#btn-toggle-bar").removeClass('active');
    $("#main-home-right").addClass('sm-active');
    $("#main-navigation").addClass('sm-active');
    $("#main-home-left").addClass('sm-active');
    if ($(window).width() <= 767 && $('#navbar').hasClass('in')) //valida si esta en móvil y cierra el menu de navegación si se dejo abierto
        $('.navbar-toggle').click();
}

//deshabilita el scroll izquierdo
function disable_scroll_left_bar() {
    $('#main-home-left').removeClass('enable-scroll');
    $('#main-home-left').addClass('disable-scroll');
}

//habilita el scroll izquierdo
function enable_scroll_left_bar() {
    $('#main-home-left').removeClass('disable-scroll');
    $('#main-home-left').addClass('enable-scroll');
}

/*agrega una aplicación a la lista de aplicaciones*/
function add_app_to_list(app) {
    var appItem = '';
    appItem += '<div id="app-' + app.id + '-' + app.sessionIntegrated + '">';

    if (app.enabled == true)
        appItem += '<a href="' + app.url + '">';
    else
        appItem += '<a href="">';

    appItem += '<img src="/Consulta/img/apps/' + app.iconName + '" alt="" />';
    appItem += app.alias;
    appItem += '<i class="fa fa-dot-circle-o" aria-hidden="true"></i>';
    appItem += '</a>';
    appItem += '</div>';

    return appItem;
}
/*** FUNCIONES PARA SIDE BAR ***/

/*** FUNCIONES PARA MAIN HOME ***/

// efecto al iniciar sesión
function mostrar_main_home() {
    $("#home-body").animate({
        'height': '100%'
    }, 300, "linear", function () {
        $('#login-body').hide();
        $('#main-navigation').show();
        $('#btn-toggle-bar').find('i').animateCss('shake');
        /*if ($(window).width() <= 767)
         $('.navbar-toggle').click();*/
    });
}

// efecto al cerrar sesión
function esconder_main_home() {
    $('#login-body').show();
    $('#main-navigation').hide();
    $("#home-body").animate({
        'height': '0px'
    }, 300, "linear", function () {
        $('#username').focus();
    });
}

//deshabilita el scroll derecho
function disable_scroll_right_bar() {
    $('#main-home-right').removeClass('enable-scroll');
    $('#main-home-right').addClass('disable-scroll');
}

//habilita el scroll derecho
function enable_scroll_right_bar() {
    $('#main-home-right').removeClass('disable-scroll');
    $('#main-home-right').addClass('enable-scroll');
}

/*** FUNCIONES PARA MAIN HOME ***/

$(document).ready(function documentReady() {
    $("#btn-do-new-pass").hide();
    $("#password_repit").parent().hide();
    $("#email").parent().hide();
    $("#password_repit").attr('placeholder', $('#txt_password').val());
    $("#password").attr('placeholder', $('#txt_password').val());
    //$("#login-form-info").css("display", "none");

    /*** FUNCIONES EJECUTADAS EN CARGA DE LA PAGINA ***/

    //valida el modo de la barra de navegación, si es fondo transparente o sólido. 
    //validate_navbar_mode();

    //carga los datos sel usuario autenticado de si lo hay
    /*$.getLoggedUser({
     requestUrl: "/SPE/users/logged/info",
     complete: function(userData){
     show_nav_logged(userData);
     }
     });*/

    //carga las aplicaciones del usuario que este autenticado en la lista
    /*$.getLoggedUserApps({//getLoggedUserApps esta definido en el archivo UserSessionUtils.js
     requestUrl: "/SPE/users/logged/apps",
     complete: function (apps) {
     var remoteUrlApps = [];
     $('#app-list').find('div').remove(); //se remueven todas las apps de la lista
     $.each(apps, function (index, app) {//se itera en la lista de aplicaciones
     if (app.enabled && app.sessionIntegrated)//verificamos si la aplicacion esta habilitada y si tiene integración de sesión
     remoteUrlApps.push(app.url);//agrega la url de la app a la coleccion para mantener viva la session en esas apps
     if (app.visible)//si es visible se agrega a la lista del sidebar
     $('#app-list').append(add_app_to_list(app));
     });
     
     LOGGED_USER_APPS = remoteUrlApps; //almacenamos las urls en una variable global para no tener que cargar las apps mientras la pagina no se recargue
     
     //hacemos refresh la sesión en las aplicaciones del usuario
     $.refreshUserSession({
     requestUrl: LOGGED_USER_APPS
     });
     }
     });*/

    /*** FUNCIONES EJECUTADAS EN CARGA DE LA PAGINA ***/

    //controla el slider
    /*$('.flexslider').flexslider({
     animation: "fade",
     animationLoop: true,
     pauseOnHover: false,
     touch: true,
     controlNav: false,
     directionNav: true
     });*/

    //scroll personalizado para parte derecha
    /*$("#main-home-right").mCustomScrollbar({
     theme: "inset-3-dark",
     autoHideScrollbar: false,
     scrollbarPosition: "inside",
     scrollInertia: 500, //da efecto de lentitud al hacer scroll
     callbacks: {
     whileScrolling: function () {//callback durante el scroll  
     validate_navbar_selected_menu_item(); //valida que opción del menu esta seleccionada en función del scroll. Función definida en "navigationBar.js"
     //validate_navbar_mode(); //valida el modo de la barra de navegación, si es fondo transparente o sólido. Función definida en "navigationBar.js" 
     },
     onInit: function () {
     //minimiza extraño bug en internet explorer que genera un espacio blanco de manera aleatoria algunas veces cuando se recarga la página
     /$("#home-body").css("height","auto");
     $("#home-body").css("height","100%");/
     }
     }
     });*/

    //scroll personalizado para parte izquierda
    /*$("#main-home-left").mCustomScrollbar({
     theme: "inset-3-dark",
     autoHideScrollbar: true,
     scrollbarPosition: "outside",
     scrollInertia: 500, //da efecto de lentitud al hacer scroll
     callbacks: {
     whileScrolling: function () {//callback mueve el menú a la posición correcta cuando se hace scroll                
     $items = $('#left-sidebar-navbar-collapse').find('li.open');
     if ($items.length) {
     var posx = parseInt($items.offset().top - $(document).scrollTop());
     $('ul:first', $items).css('top', posx);
     }
     }
     }
     });*/

    //controlar el modo de la barra de navegación en resize    
    $(window).on('resize', function () {
        //validate_navbar_mode();//valida el modo de la barra de navegación, si es fondo transparente o sólido. Función definida en "navigationBar.js"
        validate_width();
    });

    //valida si se hace click fuera del menu reposive de la barra de navegación para cerrarlo
    $(document).on('click', function (event) {
        if (!$(event.target).closest('#navbar').length) {
            if ($(window).width() <= 767 && $('#navbar').hasClass('in'))
                $('.navbar-toggle').click();
        }
    });

    /*** EVENTOS DE BOTONES  ***/

    // evento botón logout de usuario
    $("#btn-do-logout").click(function (e) {
        e.preventDefault();
        cerrar_sesion();
    });

    // evento cerrar pantalla de login de usuario
    $("#close-login-screen").click(function (e) {
        e.preventDefault();
        mostrar_main_home();
        //hacemos refresh la sesión en las aplicaciones del usuario
        $.refreshUserSession({
            requestUrl: LOGGED_USER_APPS
        });
    });

    // evento ir a la pantalla de login de usuario
    $("#login-item").click(function (e) {
        e.preventDefault();
        esconder_main_home();
        //hacemos refresh la sesión en las aplicaciones del usuario
        $.refreshUserSession({
            requestUrl: LOGGED_USER_APPS
        });
    });

    // evento botón hacer login de usuario
    $("#btn-do-login").click(function (e) {
        e.preventDefault();
        autenticar_usuario();
    });
    /*$("#btn-do-new-pass").click(function (e) {
        e.preventDefault();
        new_pass_usuario();
    });*/
    // evento tecla enter para hacer login
    $('#login-form').on('keydown', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            autenticar_usuario();
        }
    });

    /*** EVENTOS DE BOTONES  ***/

    /*** EVENTOS PARA SIDEBAR  ***/
    //cuando se hace clik en la cabecera de un menu
    $(".list-header").click(function (e) {
        e.preventDefault();
        $menuList = $(this).parent();
        if ($menuList.hasClass('closed'))
            $menuList.removeClass("closed");
        else
            $menuList.addClass("closed");

        //hacemos refresh la sesión en las aplicaciones del usuario
        $.refreshUserSession({
            requestUrl: LOGGED_USER_APPS
        });
    });

    //controla el click del toggle de la barra
    $("#btn-toggle-bar").click(function (e) {
        e.stopPropagation();
        if (!$("#btn-toggle-bar").hasClass('active')) {
            show_side_bar();
            enable_scroll_left_bar();
        } else {
            disable_scroll_left_bar();
            hide_side_bar();
        }

        if ($(window).width() <= 1024) {
            $(".dark-overlay-layer").fadeToggle(400);
        }

        //hacemos refresh la sesión en las aplicaciones del usuario
        $.refreshUserSession({
            requestUrl: LOGGED_USER_APPS
        });
    });


    //cuando se hace clik en una aplicación del menú de aplicaciones
    /*$('#app-list').on('click', 'a', function (e) {
        e.preventDefault();
        var id_app = $(this).parent().attr('id');
        var url_app = $(this).attr('href');
        console.log(id_app + " " + url_app);
        if (url_app.trim() != "") {
            dirigir_app(id_app, url_app);
        } else {
            $("#modal-info").showMessageInfo({
                title: "Aplicación no disponible.",
                message: "La aplicación no se encuentra disponible por el momento.",
                type: InfoMessageType.INFO
            });
        }
    });*/

    function dirigir_app(id, url) {
        $(".loading-screen-layer").fadeToggle(200, function () {
            window.location.href = url;
        });
    }

    /*** EVENTOS PARA SIDEBAR  ***/


});
