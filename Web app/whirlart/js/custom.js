var step =0;
var name;
var email;
var $uploadContentCrop;
var $uploadStyleCrop;
var base64content;
var base64style;
var contentcropinitvar =1;
var stylecropinitvar =1;
var s3url = "https://s3.amazonaws.com/";
var i=2;
var viewportwidth  = 400;
var viewportheight = 300;
var slider;
var slider1;
var slider2;

if($('body').width() < 640){
	 viewportwidth  = 300;
	 viewportheight = 270;
}

var confirmationMessage1 =false;

/*window.addEventListener("beforeunload", function (e) {

	if(confirmationMessage1){
     var confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';
    (e || window.event).returnValue = confirmationMessage; 
    return confirmationMessage;

    }
});
*/
window.onload = function() {
    $(".loader").fadeOut("slow");

   slider =  $('#lightSlider').lightSlider({
        item:1,
        loop:true,
        controls:false,
        auto:true,
        enableTouch:false,
        enableDrag:false,
        pause:3500,
        slideMargin:10
    });  

   slider2 = $('#lightSlider2').lightSlider({
        item:1,
        loop:true,
        slideMargin:10,
        pager:false,
        pause:3500,
        enableTouch:false,
        enableDrag:false,
        controls:false,
        auto:true
    });  

  slider1 =   $('#lightSlider1').lightSlider({
        item:1,
        loop:true,
        pager:false,
        controls:false,
        enableTouch:false,
        enableDrag:false,
        auto:true,
        pause:3500,
        slideMargin:10 ,
		onSliderLoad:function() {      
		$('.hmb21').addClass('borderclr');
		$('.clsl1').addClass('blur');
		$('.clsl11').addClass('blur1');
		$('.clsl21').addClass('blur2');
		},
      	onAfterSlide: function() {      
		animatio(i);
		i= i+1;
		if(i > 5){
			i =1;
		}
	}
    });  
setTimeout(function(){
$('.lSPager.lSpg li').css('pointer-events','none');
},1500);

};

function slidergo(num){
    slider.goToSlide(num);  
    slider1.goToSlide(num);    
    slider2.goToSlide(num); 
    $('.hme2').removeClass('borderclr');
    $('.hmb2'+num).addClass('borderclr');     
    i = num;
}

function animatio(kk){
	$('.hme2').removeClass('borderclr');
	$('.hmb2'+kk).addClass('borderclr');
	$('.clsl'+kk).addClass('blur');
	$('.clsl1'+kk).addClass('blur1');
	$('.clsl2'+kk).addClass('blur2');
	var jj = kk-1;
	if(kk === 1){
		jj = 5;
	}
	$('.hmb2'+jj).removeClass('borderclr');
	$('.clsl'+jj).removeClass('blur');
	$('.clsl1'+jj).removeClass('blur1');
	$('.clsl2'+jj).removeClass('blur2');
}

	$('#prfname').text(localStorage.getItem("uname"));
	$('.prfname').text(localStorage.getItem("uname"));
setformval();
function search(ele) {
	if($('#uname').val()){
	var namevalue = $('#uname').val();
	if(ele.key === 'Enter') {
		$('#unameinp').hide();
		$('#emailinp').fadeIn();
		$('#getmailid').append('Good '+namevalue+', Please tell me your email id, So that  I can send you the email, once I finished the process');
	}
  }
}

function  adduserinput(){
	var msg = $('#usermsg').val();
	addbtnuserinput(msg,step);
}

function addbtnuserinput(msg1,step){
	var bot = $("#usermsgip").clone();
	bot.css('display','block');
	var msg = msg1;
	if(msg){
		$("p", bot).html(msg);
		bot.appendTo("#style-4");	
		switch (step)
		{
			case 1:
			first();
			break;
			case 2:
			second();
			$('#usermsg').val("");
			break;
			case 3:
			three();
			break;
			case 4:
			four();
			break;
			case 5:
			five();
			break;
			case 6:
			//six();
			break;
			case 7:
			seven();
			break;

			default:
			$('#usermsg').val("");
		}
	}
	scrollbotm();
}

function contnclick(){
	$('#contntfor').click();
}

function styleclick(){
	$('#stylefor').click();
}


function first(){
	$('#start').hide();
	//	$('#loading').show();
	//$('#botmsgip').show();
	var contentslider=$('#contentslider');

	setTimeout(function(){ 
		contentslider.css('visibility','visible');
		var str =  'Upload your own Content image or use one of our own to experiment(You can always come back and try on your own image) <br>';
	    var upbtn = '<center><label onclick="contnclick()" class="btn-bs-file btn btn-primary btn-round-lg ">Upload your own image </label><center><br>';
		addbtnbotinput(str); 
		$('#style-4').append(contentslider);
		$('#style-4').append(upbtn); 
		$('#createnewbtn').hide();
		$('#upload-content').show();
		$('#style-4').append('<br><div class="barphoto" id="content-image"></div>');	
		$('#loading').hide();
		scrollbotm();
	}, 1000);
}


function second(){
	$('#confirm').hide();	
	if(!(localStorage.getItem("uname"))){
		$('#loading').show();
		setTimeout(function(){ 
			addbtnbotinput('Well, can you please tell me your name?');
			$('#loading').hide();
			$('#inputbox').show();
		}, 1000);
		step=3;
		$('#usermsg').val("");
		}
	else{
		five();
		name = localStorage.getItem("uname");
		email =localStorage.getItem("email");
		setformval();
	}
}


function three(){
	name =$('#usermsg').val();
	setTimeout(function(){ 
	addbtnbotinput('good '+name+', Please tell me your email id, So that  I can send you the email, once I finished the process');
	}, 1000);
	step=5;
	$('#usermsg').val("");
}

function validateEmail($email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailReg.test( $email );
}

function five(){
	email = $('#usermsg').val();
	if( !validateEmail(email)) { 
		addbtnbotinput('PLease enter valid email id' );
	}
	else{
		if(!(localStorage.getItem("uname"))){
			settolocalstorage();
		}
		$('#inputbox').hide();
		$('#loading').show();
		setTimeout(function(){ 
			addbtnbotinput('Wait '+name+', I am processing your image.' );
		}, 1000);
		step=6;
		$('#usermsg').val("");
		contentImageFunction();
	}
}

function six(min,key,id){
		confirmationMessage1 = false;
		var reslink='https://www.whirldatascience.com/whirlart/?key='+key+'&id='+id;
		$('#finished').append('<h4 class="heading">OK '+name+', Gotcha! Your WhirlArt will be generated in '+min+' mins. Check your mailbox or click <a href='+reslink+'>here</a></h4>' );
		$('#finished').append('<a href="https://www.whirldatascience.com" type="button" class="btn prcdbtn">Visit Our site</a>');
		$('#finished').append('<button onclick="reload();" type="button" class="btn viprcdbtn">Create new</button>');
		$('#uploading').hide();
}

function seven(){
	setTimeout(function(){
		$('#thankubtn').hide()
		addbtnbotinput('Thank you '+name +' you can create another style image by click the "create new" button' );
	}, 1000);
}


function whatisthis1(){
	var bot = $("#botmsgip").clone();
	bot.css('display','block');
	setTimeout(function(){ 
		var str ='<iframe class="video" src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1"  frameborder="0" allowfullscreen></iframe>';
		addbtnbotinput(str);
	}, 1000);
}

function settolocalstorage(){
	localStorage.setItem("email", email);
	localStorage.setItem("uname", name);
	setformval();
}

function setformval(){
	$('#inputEmail').val(localStorage.getItem("email"));
	$('#fullName').val(localStorage.getItem("uname"));
	$('#prfname').text(name);
	$('.prfname').text(name);
}


function profile(){
	$('#modal-login').click();
}

function saveformval() {
	email =	$('#inputEmail').val();
	name  =	$('#fullName').val();
	settolocalstorage();
	$('#modal-login').click();
}

function addbtnbotinput(msg1){
	var bot = $("#botmsgip").clone();
		bot.css('display','block');
	var msg = msg1;
	var msg = $.parseHTML(msg);
	if(msg){
		$("p", bot).html(msg);
		bot.appendTo("#style-4");
	}
	scrollbotm();
}

function scrollbotm(){
	$("#style-4,#style-5").animate({
		scrollTop: $('#style-4')[0].scrollHeight - $('#style-4')[0].clientHeight
	}, 1000);
}

function gallarycontentimg(src){
	if(contentcropinitvar ===1 ){
		contentcropinit();
	}
	contentcropinitvar++;
	$uploadContentCrop.croppie('bind', {
		url :src
		});
	scrollbotm();
    confirmationMessage1 =true;
}

function gallarystyleimg(src){
	if(stylecropinitvar ===1 ){
		stylecropinit();
		readstyleafter();
	}
	stylecropinitvar++;
	$uploadStyleCrop.croppie('bind', {
			url : src
	});
	scrollbotm();
}

/*READ CONTENT FILE*/
function readContentFile(input) {
	if (input.files && input.files[0]) {

		var reader = new FileReader();
		reader.onload = function(e) {
			var tt = e.target.result.split(';');
			console.log(tt[0]);

			if(tt[0] == 'data:image/jpeg' ){
				$uploadContentCrop.croppie('bind', {
					url : e.target.result
				});
				$('.content-image').addClass('ready');
				contentcropinit();
				contentcropinitvar++;
				confirmationMessage1 =true;
			}else{
			$('#myerror').modal('show');
			}
		
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function done1(){
	readContentFileafter();
}
function done2(){
second();
}

function readContentFileafter(){
	var styleslider=$('#styleslider');
		$('#upload-content').hide();
		$('#loading').show();
		setTimeout(function(){ 
			styleslider.css('visibility','visible');
			var str ='Upload your Style image or experiment with one of our own<br>';
			var upbtn = '<center><label onclick="styleclick()" class="btn-bs-file btn btn-primary btn-round-lg ">Upload your own style image </label></center><br>';
			$('#style-4').append('<h2>Style image</h2>'); 
			addbtnbotinput(str);
			$('#style-4').append(styleslider);
			$('#style-4').append(upbtn); 
			$('#style-4').append('<br><div id="style-image"></div>');

			$('#loading').hide();
			$('#upload-pattern').show();
			scrollbotm();
		}, 1000);
}

/*READ STYLE IMAGE*/
function readStyleFile(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
		
		var tt = e.target.result.split(';');
		console.log(tt[0]);
			if(tt[0] == 'data:image/jpeg' ){

			$uploadStyleCrop.croppie('bind', {
				url : e.target.result
			});
			$('.style-image').addClass('ready');
			stylecropinit();
			if(stylecropinitvar ===1){
				readstyleafter();
			}
			stylecropinitvar++;
			setTimeout(function(){ 
				scrollbotm();
			}, 1000);
		 }
		 else{
			$('#myerror').modal('show');
		 }
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function readstyleafter(){
		$('#upload-pattern').hide();
		$('#loading').show();
		setTimeout(function(){ 
			$('#loading').hide();
			$('#confirm').show();
			scrollbotm();
		}, 1000);
}

/*CROP CONTENT IMAGE*/
function contentImageFunction() {

	$uploadContentCrop.croppie('result', {
		type : 'canvas',
		size :{width :400 ,height:300},
		format : 'jpeg'
	}).then(function(contentImageBase64) {
		base64content =contentImageBase64;
    	$('#contimgshow,#finalcontent').attr('src',base64content);
    	$.fn.fullpage.moveSectionDown();   
 	},function(data) {
		$('#myerror').modal('show');
  	});
}

/*CROP STYLE IMAGE*/
function styleImageFunction() {
	$uploadStyleCrop.croppie('result', {
		type : 'canvas',
		size :{width :400 ,height:300},
		format : 'jpeg'
	}).then(function(styleImageBase64) {
		 $('#finalstyle').attr('src',styleImageBase64);
	    base64style =styleImageBase64;
	    $.fn.fullpage.moveSectionDown();
		finalupload();  
	},function() {
		$('#myerror').modal('show');
  	});
}

function finalupload(){
if(localStorage.getItem("uname")){
		    $('#formid').hide();
    		//$('#confirmtion').show();
			confirmtion();
       	}
}

function confirmtion(){
	    $('#confirmtion').hide();

	 	document.getElementById('finalcontent').style.pointerEvents = 'none';
		document.getElementById('finalstyle').style.pointerEvents = 'none';

	 	name = localStorage.getItem("uname");
		email =localStorage.getItem("email");
	    $('#formid').hide();
		$('#uploading').show();
    	$('#uploading').append("<h4 class='heading'>Wait "+name+", I am processing your image</h4>" );
   	    ajaxCall( name, email, base64content, base64style);
}



/*INITIALIZING CONTENT UPLOAD*/
$('#content-upload').on('change', function() {
	readContentFile(this);
});

/*INITIALIZING STYLE UPLOAD*/
$('#style-upload').on('change', function() {
	readStyleFile(this);
});


$uploadContentCrop = $('#content-image').croppie({
		viewport : { width : viewportwidth,  height : viewportheight },
		boundary : { width : viewportwidth,	 height : viewportheight },
		showZoomer: false,
		enableOrientation: true
			});
$uploadContentCrop.croppie('bind', {
	url : 'img/400x300.png'
});

$uploadStyleCrop = $('#style-image').croppie({
		viewport : { width : viewportwidth,	height : viewportheight},
		boundary : { width : viewportwidth, height : viewportheight },
		showZoomer: false,
		enableOrientation: true
	});
$uploadStyleCrop.croppie('bind', {
	url : 'img/400x300.png'
});


function rotatecnt(degree){
	$uploadContentCrop.croppie('rotate',degree);
}

function rotatesty(degree){
	$uploadStyleCrop.croppie('rotate',degree);
}


function contentcropinit(){
	$('#content-info').hide();
	$('#contnimgdone').fadeIn("slow");
	$('.cntrot').fadeIn("slow");
	if($('body').width() < 640){
		$('#cnmobtip').fadeIn("slow");
	}else if($('body').width() < 840){
		$('#cnmobtip').fadeIn("slow");
	}else{
		$('#cntip').fadeIn("slow");
	}
		$('#cntip').addClass("tipsshw");
		$('#cnmobtip').addClass("mobtipsshw");
	
	$("#content-image img").css('opacity', 1);
	scrollbotm();
}

function stylecropinit(){
		$('#style-info').hide();
		$('.stylrot').fadeIn("slow");
		$('#stylwimgdone').fadeIn("slow");
		if($('body').width() < 640){
		     $('#stymobtip').fadeIn("slow");
		}else if($('body').width() < 840){
		     $('#stymobtip').fadeIn("slow");
		}else{
     		$('#stytip').fadeIn("slow");
     	}
     	$('#stytip').addClass('tipsshw');
     	$('#stymobtip').addClass('mobtipsshw');
	$("#style-image img").css('opacity', 1);
 scrollbotm();
}


function befrajax(){
name = $('#uname').val();
email = $('#uemail').val();
settolocalstorage();
name = localStorage.getItem("uname");
email =localStorage.getItem("email");
confirmtion();
}


/*AJAX CALL*/
function ajaxCall( uname, emailbox, contentImage, styleImage) {
	var data = new Object();
	data.username = uname;
	data.email   = email;
	data.contentImage = contentImage;
	data.styleImage = styleImage;

	var data2 = JSON.stringify(data);
	$.ajax({
		url : "https://ilv3li44fd.execute-api.us-east-1.amazonaws.com/v1?action=clientRequest",
		type : "POST",
		dataType: "json",
		contentType: "application/json",
		data: data2,
		headers : {
			'Access-Control-Allow-Origin' : '*'
		},
		cache : false,
		processData : false,
		success : function(data) {
			//console.log(data);
			if(data.status == 200){
			six(data.estimation_time,data.key,data.id);
			}
			else{
			errror();
			}
		},
		error: function(data) {       
		     	errror();
		}
	});
}


function errror(){
	$('#finished').append('<h4 class="heading">Oops! Something went wrong!!</h4>' );
	$('#finished').append('<button onclick="reload();" type="button" class="btn prcdbtn">Create new</button>');
	$('#uploading').hide(); 	
}

var swiper1 = new Swiper('.swiper-container11', {
	spaceBetween: 2,
	slidesPerView: 5,
	navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

	breakpoints: {
		1024: {
			slidesPerView: 5,
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 2,
		},
		640: {
			slidesPerView: 2,
			spaceBetween: 2,
		},
		320: {
			slidesPerView: 1,
			spaceBetween: 2,
		}
	}

});

var swiper2 = new Swiper('.swiper-container22', {
	spaceBetween: 2,
	slidesPerView: 5,
	navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },


	breakpoints: {
		1024: {
			slidesPerView: 5,
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 2,
		},
		640: {
			slidesPerView: 2,
			spaceBetween: 2,
		},
		320: {
			slidesPerView: 1,
			spaceBetween: 2,
		}
	}

});


/*RESULT*/
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var key = getUrlParameter('key');
if (key == 'whirlart-images'){

//$('#go').click();	
$(".head").addClass('aniback');
$('.aniback').css('height','auto');
$("#prfimg").fadeIn(3000);

$('.section-one').hide();
$('#start').hide();
$('#style-4').hide();
$('#result').show();
$('#resultstart').show();
var bucketname =  getUrlParameter('key');
var foldername =  getUrlParameter('id');
//console.log(s3url,bucketname , foldername);
var contenturl = s3url+bucketname+'/'+foldername+'/contentImage.jpg';
var styleurl   = s3url+bucketname+'/'+foldername+'/styleImage.jpg';
var resultimg  = s3url+bucketname+'/'+foldername+'/processedImage.jpg';

//updateImage(resultimg);

		$('#fcontent').attr('src',contenturl);
		$('#fstyle').attr('src',styleurl);
		$('#fresult').attr('src',resultimg);
		$('#downloadres').attr('href',resultimg);
	    //$("meta[property='og:image']").attr('content', resultimg);
	    $("meta[name='fbimage']").attr("content", resultimg);
	    $("meta[name='twitter\\:image']").attr('content', resultimg);
	    mybrwsFunction();

}


window.fbAsyncInit = function() {
    FB.init({
        appId            : '172807293348238',
        status           : true,
        cookie           : true,
        version          : 'v2.10'                
    });
    
    $( '#fbshareclick' ).click(function(e){
    	e.preventDefault();
    	var resurl      = window.location.href;
        var image = $('#fresult').attr('src');
        var uname =	localStorage.getItem("uname");
 		FB.ui({
    	method: 'share_open_graph',
    	action_type: 'og.shares',
     	display: 'popup',
  		action_properties: JSON.stringify({
    	object: {
      	'og:url': resurl,
      	'og:title': 'WhirlArt',
      	'og:description': 'I created a awesome art using WhirlArt ',
      	'og:image': image
  	}
	})
	 },
	  function(response){});
})
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



 function mybrwsFunction() { 
     if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
    {
        //alert('Opera');
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
        //alert('Chrome');
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        //alert('Safari');
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
    {
    $('#downloadres').attr('href','#');
    $('#downloadres').attr('data-link',resultimg);
var links = document.querySelectorAll("#downloadres"), i = 0, lnk;
while(lnk = links[i++]) {
  if (lnk.dataset.link.length) lnk.onclick = toBlob;
}

function toBlob(e) {
  e.preventDefault();
  var lnk = this, xhr = new XMLHttpRequest();
  xhr.open("GET", lnk.dataset.link);
  xhr.responseType = "blob";
  xhr.overrideMimeType("octet/stream");
  xhr.onload = function() {
    if (xhr.status === 200)
      window.location = (URL || webkitURL).createObjectURL(xhr.response);
  };
  xhr.send();
  return false
}
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
      //alert('IE'); 
    }  
    else 
    {
       //alert('unknown');
    }
    }



function reload(){
   if(!confirmationMessage1){
       window.location = window.location.href.split("?")[0];
   }
 else{
 	   $('#leaveError').modal('show'); 
	}
}

$('#leaveyes').click(function(){
     window.location = window.location.href.split("?")[0];
});


function updateImage(image_url){ 
	var http = new XMLHttpRequest(); 
	http.open('HEAD', image_url, false); 
	http.send(); 
	if(http.status==404){
		$('#fcontent').attr('src',contenturl);
		$('#fstyle').attr('src',styleurl);
	}else{
		$('#fcontent').attr('src',contenturl);
		$('#fstyle').attr('src',styleurl);
		$('#fresult').attr('src',resultimg);
		$('#downloadres').attr('href',resultimg);
	}
}

 $("#myhelpvdo").on("hidden.bs.modal",function(){
    $("#iframeYoutube").attr("src","#");
  })

function changeVideo(vId){
  var iframe=document.getElementById("iframeYoutube");
  iframe.src="https://www.youtube.com/embed/"+vId;
  $("#myhelpvdo").modal("show");
}

window.onresize = function(){
	resize();
}
resize();


function resize(){
    if ($('body').width() < 640){
		$('.swiper-button-prev').show();
		$('.swiper-button-next').show();
		$('.firstColumn').insertAfter(".secondColumn");
        $('#hmsum').hide();
        $('#twt').hide();
    }
    else{
	    $('.secondColumn').insertAfter(".firstColumn");
		$('.swiper-button-prev').hide();
		$('.swiper-button-next').hide();
	    $('#hmsum').show();
	    $('#twt').show();
    	}
}

function cntntdone(){
   	contentImageFunction();
}

function styledone(){
   	styleImageFunction();
}


$('#uname').focus(function() {

  $('#portoverlay').attr("style", "display: none !important");

});
$('#uemail').blur(function() {

  $('#portoverlay').attr("style", "display: none ");

});