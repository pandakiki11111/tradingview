(function($) {
  "use strict"; // Start of use strict
  
  $("#createAccount").click(function(e){
	  if(identifier1 != null && identifier1 != "" && identifier1 != "null"){
		  if($("#account").val()==""){
			  var params = new Object();
				 
			  params.mail = identifier1;
			  
			  var json = JSON.stringify(params);
			  
			  $.ajax({
				type: "POST",
				dataType: "json",
				data: json,
				contentType :"application/json; charset=UTF-8",
				headers:{
		            "Access-Control-Allow-Origin": "*"
				},
				url : "/createAccount",
				success : function(data){
					if(data.result.result == "failed"){
						alert("Account issue failed.");
					}else{
						$("#account").val(data.result.result);
						getbalance();
					}
				},
				error : function(data){
					alert("Account issue failed.");
					console.log(data);
				}
			  });
		  }
	  }else{
		  alert("You can check after login.");
		  window.location.href="/";
	  }
  });
  
  function getbalance(){
	  if($("#account").val() ==""){
		  alert("This service requires an account.");
	  }else{
		  var params = new Object();
			 
		  params.account = $("#account").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/getBalance",
			  success : function(data){
				  if(data.result.result == "failed"){
					  alert("Balance lookup failed.\n"+data.result.message);
					  $("#eth_balance").val(0);
					  $("#tpl_balance").val(0);
				  }else{
					  $("#eth_balance").val(data.result.eth_balance);
					  $("#tpl_balance").val(data.result.tpl_balance);
				  }
			  },
			  error : function(data){
				  alert("Balance lookup failed.");
				  console.log(data);
			  }
		  });
	  }
  }
  
  $("#getbalance").click(function(e){
	  getbalance();
  });
  
  $("#gettransaction_ether").click(function(e){
	  if($("#eth_txid").val() == ""){
		  alert("Please input the txid of the withdrawal ether.");
		  $("#eth_txid").focus();
	  }else if($("#eth_txid").val().substring(0,2) != "0x"){
		  alert("Please check txid. txid starts with '0x'.");
	  }else{
		  var params = new Object();
			 
		  params.txid = $("#eth_txid").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/getEtherTx",
			  success : function(data){
				  if(data.result.result == "failed"){
						alert("Transaction lookup failed.");
					}else if(data.result.result == null){
						alert("The current state is pending. Please show me again after a while.");
					}else{
						var result = JSON.parse(data.result.result);
						var textedJson = JSON.stringify(result,  null, '\t');
						$("#result").val(textedJson);
					}
			  },
			  error : function(data){
				  alert("Transaction lookup failed.");
				  console.log(data);
			  }
		  });
	  }
  });
  
  
  $("#gettransaction_tpl").click(function(e){
	  if($("#tpl_txid").val() == ""){
		  alert("Please enter txid of the withdrawn TPL token.");
		  $("#tpl_txid").focus();
	  }else if($("#tpl_txid").val().substring(0,2) != "0x"){
		  alert("Please check txid. txid starts with '0x'.");
	  }else{
		  var params = new Object();
			 
		  params.txid = $("#tpl_txid").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/getEtherTx",
			  success : function(data){
				  $("#result").val("");
				  if(data.result.result == "failed"){
						alert("Transaction lookup failed.");
					}else if(data.result.result == null){
						alert("The current state is pending. Please show me again after a while.");
					}else{
						var result = JSON.parse(data.result.result);
						var textedJson = JSON.stringify(result,  null, '\t');
						$("#result").val(textedJson);
					}
			  },
			  error : function(data){
				  alert("Transaction lookup failed.");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#etherscan_ether").click(function(e){
	  if($("#eth_txid").val() == ""){
		  alert("There is no withdrawal information for the ethereum.");
		  $("#eth_txid").focus();
	  }else if($("#eth_txid").val().substring(0,2) != "0x"){
		  alert("Please check txid. txid starts with '0x'.");
	  }else{
		  window.open("https://etherscan.io/tx/"+$("#eth_txid").val());
	  }
  });
  
  $("#etherscan_tpl").click(function(e){
	  if($("#tpl_txid").val() == ""){
		  alert("There is no withdrawal information for the TPL token.");
		  $("#tpl_txid").focus();
	  }else if($("#tpl_txid").val().substring(0,2) != "0x"){
		  alert("Please check txid. txid starts with '0x'.");
	  }else{
		  window.open("https://etherscan.io/tx/"+$("#tpl_txid").val());
	  }
  });
  
  $("#buycoin").click(function(e){

	  if(identifier1 == null || identifier1 == "" || identifier1 == "null"){
		  alert("This service requires login.");
	  }
	  
	  else if($("#ether").val() < 100){
		  alert("The minimum unit for purchasing tokens is 100 ETH.");
	  }
	  
	  else if($("#ether").val() > $("#myether span").text()){
		  $("#result_text span").text("");
		  $("#result_text span").html("<font color='red'>You can not make purchases because there is not enough ETH balance.</font>");
		  $("#ether").focus();
	  }else if($("#ether").val() == ""){
		  $("#result_text span").text("");
		  $("#result_text span").html("<font color='red'>Please enter the quantity of TPL tokens you wish to purchase.</font>");
		  $("#ether").focus();
	  }else if($("#ether").val() == 0){
		  $("#result_text span").text("");
		  $("#result_text span").html("<font color='red'>Purchase quantity must be greater than zero.</font>");
		  $("#ether").focus();
	  }else{
		  $("#result_text span").text("");
		  $("#result_text span").text("You have requested to purchase a token. Please wait.");
		  
		  var params = new Object();
			 
		  params.id = identifier1;
		  params.password = $("#password").val();
		  params.tpl = $("#tpl").val();
		  params.eth = $("#ether").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/buytoken",
			  success : function(data){
				  
				  if(data.result.result == "failed"){
					  $("#result_text span").html("<font color='red'>Token purchase failed.</font>");
				  }else{
					var result = JSON.parse(data.result.result);
					if(result.result == "error"){
						$("#result_text span").html("<font color='red'>Token purchase failed.</font><br>("+result.message+")");
					}else{
						var textedJson = JSON.stringify(result,  null, '\t');
						$("#result_text span").html("<font color='darkgreen'><b>The token was successfully purchased.</b></font> Check txid on the screen below ↓");
						
						$("#eth_txid").val("");
						$("#tpl_txid").val("");
						
						$("#eth_txid").val(result.eth_spent_txid);
						$("#tpl_txid").val(result.tpl_buy_txid);
						
						getbalanceaftertoken();
					}
				  }
			  },
			  error : function(data){
				  $("#result_text span").html("<font color='red'>Token purchase failed.</font>");
				  console.log(data);
			  }
		  });
	  }
  });
  
  function getbalanceaftertoken(){
	  var params = new Object();
		 
	  params.mail = identifier1;
	  
	  var json = JSON.stringify(params);
	  
	  $.ajax({
			type: "POST",
			dataType: "json",
			data: json,
			contentType :"application/json; charset=UTF-8",
			headers:{
	            "Access-Control-Allow-Origin": "*"
			},
			url : "/balanceInfo",
			success : function(data){
				if(data.result.result == "failed"){
					alert("Balance lookup failed.\n"+data.result.message);
					$("#myether span").text("0");
				}else{
					$("#myether span").text("");
					$("#myether span").text(data.result.eth_balance);
				}
			},
			error : function(data){
				alert("Balance lookup failed.");
				console.log(data);
			}
		 });
  }
  
  $("#maxtpl").click(function(e){
	 $("#ether").val($("#myether span").text());
	 ethchange();
  });
  
  $("#register_button").click(function(){
	  hideall();
	  $("#register_page").show();
  });
  
  function numberWithCommas(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

  $("#trade_button, #trade_button1").click(function(){
	  if(identifier1 != null && identifier1 != "" && identifier1 != "null"){
		  
		  hideall();
		  $("#sale_page").show();
		  
		  $.ajax({
				type: "POST",
				dataType: "json",
				data: json,
				contentType :"application/json; charset=UTF-8",
				headers:{
		            "Access-Control-Allow-Origin": "*"
				},
				url : "/getTplBalance",
				success : function(data){
					if(data.result.result == "failed"){
						alert("TPL volume lookup failed.\n"+data.result.message);
						$("#totalVolume").text("0");
					}else{
						var tplVolume = data.result.tpl_balance;
						
						var floor = Math.floor(data.result.tpl_balance);
						var comma = numberWithCommas(floor);
						$("#totalVolume").text("");
						$("#totalVolume").text(comma);

						var percentage = 1 - (floor / 1000000000);
						console.log("p"+percentage);
						var round = percentage.toFixed(1);
						$("#volumePercentage").text("");
						$("#volumePercentage").text(round);
					}
				},
				error : function(data){
					alert("TPL volume lookup failed.");
					console.log(data);
				}
			 });
		  
		  //getbalance
		  var params = new Object();
			 
		  params.mail = identifier1;
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
				type: "POST",
				dataType: "json",
				data: json,
				contentType :"application/json; charset=UTF-8",
				headers:{
		            "Access-Control-Allow-Origin": "*"
				},
				url : "/balanceInfo",
				success : function(data){
					if(data.result.result == "failed"){
						alert("Balance lookup failed.\n"+data.result.message);
						$("#myether span").text("0");
					}else{
						$("#myether span").text("");
						$("#myether span").text(data.result.eth_balance);
					}
				},
				error : function(data){
					alert("Balance lookup failed.");
					console.log(data);
				}
			 });
	  }else{
		  alert("This service requires login.");
		  window.location.href="/";
	  }
  });
  
  $("#notice_button, #notice_button1").click(function(){
	 alert("Coming soon."); 
  });
  
  $("#whitepaper, #whitepaper1").click(function(){
//	  window.location.assign('/file/whitepaper.pdf');
	  window.open('/file/whitepaper.pdf');
  });
  
  $("#login_button").click(function(){
	  hideall();
	  $("#login_page").show();
  });
  
  $("#wallet_button").click(function(){
	  hideall();
	  if(identifier1 != null && identifier1 != "" && identifier1 != "null"){
		  $("#wallet_page").show();
		  
		  var params = new Object();
			 
		  params.mail = identifier1;
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
				type: "POST",
				dataType: "json",
				data: json,
				contentType :"application/json; charset=UTF-8",
				headers:{
		            "Access-Control-Allow-Origin": "*"
				},
				url : "/getAccount",
				success : function(data){
					if(data.result.result == "failed"){
						alert("Ethereum account lookup failed.\n"+data.result.message);
					}else{
						if(!data.result.address == ""){
							 $("#account").val(data.result.address);
							 $("#createAccount").attr('disabled', true);
							 
							 getbalance();
						}
					}
				},
				error : function(data){
					alert("Ethereum account lookup failed.");
					console.log(data);
				}
			 });
	  }else{
		  alert("You can check after login.");
		  window.location.href="/";
	  }
	  
  });
  
  $("#navbar_toggle_button").click(function(e){
	 if($(this).attr("aria-expanded") == "false"){
		 $("#first-li-1").css('padding-left', '0');
		 $("#third-li-1").css('padding-left', '0');
		 $("#first-li-2").css('padding-left', '0');
		 $("#third-li-2").css('padding-left', '0');
	 }else{
		 $("#first-li-1").css('padding-left', '4%');
		 $("#third-li-1").css('padding-left', '26%');
		 $("#first-li-2").css('padding-left', '4%');
		 $("#third-li-2").css('padding-left', '26%');
	 }
  });
  
  var separator = '-';
  $( "#phone" ).text( function( i, DATA ) {
      DATA
          .replace( /[^\d]/g, '' )
          .replace( /(\d{3})(\d{3})(\d{4})/, '$1' + separator + '$2' + separator + '$3' );
      
      return DATA;
  });
  
  function validateEmail(email) {
	  var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/; 
	  return regex.test(email);
	  }
  
  $("#signButton").click(function(){
	  if($("#mail_address").val() == ""){
		  alert("Please enter your email address.");
		  $("#mail_address").focus();
	  }
	  else if(validateEmail($("#mail_address").val())== false){
		  alert("It does not fit the format of the mail address.");
		  $("#mail_address").focus();
	  }
	  else if($("#input_password").val() == ""){
		  alert("Please enter a password.");
		  $("#input_password").focus();
	  }
	  else if($("#input_password").val().length < 6){
		  alert("Your password is at least 6 characters.");
		  $("#input_password").focus();
	  }
	  else if($("#confirm_password").val() == ""){
		  alert("Please enter your password confirmation.");
		  $("#confirm_password").focus();
	  }
	  else if($("#input_password").val() != $("#confirm_password").val()){
		  alert("Password for verification does not match.");
		  $("#confirm_password").focus();
	  }
	  else if($("#phone").val() == ""){
		  alert("Please enter your phone number.");
		  $("#phone").focus();
	  }else{

		  var params = new Object();
			 
		  params.nickname = $("#nickname").val();
		  params.mail = $("#mail_address").val();
		  params.password = $("#input_password").val();
		  params.phone = $("#phone").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/register",
			  success : function(data){
				  console.log("succ",data);
				  if(data.result.result == "failed"){
					  alert("Failed to register.\n"+data.result.message);
				  }else{
					  alert("Your membership request has been completed. \nSite is available after email verification.\nPlease check your email.");
					  window.location.href="/";
				  }
			  },
			  error : function(data){
				  alert("Failed to register.");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#login_password").keydown(function(e){
	 if(e.keyCode == 13){
		 $("#loginButton").trigger("click");
	 } 
  });
  
  $("#loginButton").click(function(){
	  if($("#login_mail").val() == ""){
		  alert("Please enter your email address.");
		  $("#login_mail").focus();
	  }
	  else if(validateEmail($("#login_mail").val())== false){
		  alert("It does not fit the format of the mail address.");
		  $("#login_mail").focus();
	  }
	  else if($("#login_password").val() == ""){
		  alert("Please enter a password.");
		  $("#login_password").focus();
	  }
	  else{
		  var params = new Object();
			 
		  params.mail = $("#login_mail").val();
		  params.password = $("#login_password").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/login",
			  success : function(data){
				  if(data.result.result == "failed"){
					  alert("Login failed.\n"+data.result.message);
				  }else{
					  alert("Welcome "+data.result.nick+"!");
					  window.location.href = "/";
				  }
			  },
			  error : function(data){
				  alert("Failed to register.");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#logout_button").click(function(){
	  $.ajax({
		  type: "POST",
		  dataType: "json",
		  data: null,
		  contentType :"application/json; charset=UTF-8",
		  headers:{
              "Access-Control-Allow-Origin": "*"
		  },
		  url : "/logout",
		  success : function(data){
			  if(data.result.result == "failed"){
				  alert("Sign out failed.\n"+data.result.message);
			  }else{
				  alert("Signed out.");
				  window.location.reload(false);
			  }
		  },
		  error : function(data){
			  alert("Sign out failed.");
			  console.log(data);
		  }
	  });
  });
  
  $("#findEmail").click(function(e){
	 hideall();
	 $("#find_id_page").show();
  });
  
  $("#findPassword").click(function(e){
		 hideall();
		 $("#find_pw_page").show();
	  });
  
  $("#findidbutton").click(function(){
	  
	  if($("#phonenumber").val() == ""){
		  alert("please enter a phone number");
		  $("#phonenumber").focus();
	  }else{
		  var params = new Object();
		  
		  params.phone =  $("#phonenumber").val();
		  params.name = $("#findidname").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/findID",
			  success : function(data){
				  if(data.result.result == "failed"){
					  alert("Find ID failed.\n"+data.result.message);
				  }else{
					  alert("Check the email address shown at the bottom.")
					  $("#findidmail").val(data.result.mail);
				  }
			  },
			  error : function(data){
				  alert("Failed to query the user information you entered.");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#sendbutton").click(function(){
	  if($("#findpwphone").val() == ""){
		  alert("please enter a phone number");
		  $("#findpwphone").focus();
	  }else if($("#findpwname").val() == ""){
		  alert("please enter a name");
		  $("#findpwname").focus();
	  }else{
		  var params = new Object();
		  
		  params.phone =  $("#findpwphone").val();
		  params.name = $("#findpwname").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/findPassword",
			  success : function(data){
				  if(data.result.result == "failed"){
					  alert(data.result.message);
				  }else{
					  alert("I sent an email to change your password. Please check your mail.");
					  window.location.href = "/";
				  }
			  },
			  error : function(data){
				  alert("Failed to Change Password.");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#changepwbutton").click(function(){
	  
	  if($("#changepassword").val() == ""){
		  alert("please enter a password");
		  $("#changepassword").focus();
	  }else if($("#confirmPW").val() == ""){
		  alert("please enter a confirm password");
		  $("#confirmPW").focus();
	  }else if($("#changepassword").val() != $("#confirmPW").val()){
		  alert("Password for verification does not match.");
		  $("#confirmPW").focus();
	  }else{
		  var params = new Object();
		  
		  params.password =  $("#changepassword").val();
		  
		  console.log($("#pmail").val());
		  console.log($("#pkey").val());
		  
		  params.mail = $("#pmail").val();
		  params.key = $("#pkey").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/changePassword",
			  success : function(data){
				  if(data.result.result == "failed"){
					  alert("Change Password failed.\n"+data.result.message);
				  }else{
					  alert("Now that you have changed your password, please login again.");
					  window.location.href = "/";
				  }
			  },
			  error : function(data){
				  alert("Failed to Change Password.");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#transfer_eth_button").click(function(e){
	  $("#transfer_eth_result_div span").text("");
	  if($("#account").val() == ""){
		  alert("There is no ETH wallet address created. Please make an address first and try.");
		  $("#account").focus();
	  }
	  if($("#transfer_myaddress").val() == ""){
		  alert("Enter the address of the recipient.")
		  $("#transfer_myaddress").focus();
	  }else if($("#transfer_eth_amount").val() == ""){
		  alert("Enter the amount of ETH you want to transfer.");
		  $("#transfer_eth_amount").focus();
	  }else{
		  
		  $("#transfer_eth_result_div span").html("<font color='blue'>Request a withdrawal</font>");
		  var params = new Object();
		  
		  params.account = $("#account").val();
		  params.payee =  $("#transfer_myaddress").val();
		  params.amount = $("#transfer_eth_amount").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/transfer_ethe",
			  success : function(data){
				  if(data.result.result == "failed"){
					  $("#transfer_eth_result_div span").html("<font color='red'>failed. "+data.result.message+"</font>");
				  }else{
					  $("#transfer_eth_result_div span").html("<font color='green'>transfer success</font>");
					  $("#transfer_eth_txid").val(data.result.txid);
				  }
			  },
			  error : function(data){
				  $("#transfer_eth_result_div span").html("<font color='red'>Withdrawal failed</font>");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#transfer_tpl_button").click(function(e){
	  $("#transfer_tpl_result_div span").text("");
	  if($("#account").val() == ""){
		  alert("There is no ETH wallet address created. Please make an address first and try.");
		  $("#account").focus();
	  }
	  if($("#transfer_myaddress").val() == ""){
		  alert("Enter the address of the recipient.")
		  $("#transfer_myaddress").focus();
	  }else if($("#transfer_tpl_amount").val() == ""){
		  alert("Enter the amount of TPL you want to transfer.");
		  $("#transfer_tpl_amount").focus();
	  }else{
		  $("#transfer_tpl_result_div span").html("<font color='blue'>Request a withdrawal</font>");
		  var params = new Object();
		  
		  params.account = $("#account").val();
		  params.payee =  $("#transfer_myaddress").val();
		  params.amount = $("#transfer_tpl_amount").val();
		  
		  var json = JSON.stringify(params);
		  
		  $.ajax({
			  type: "POST",
			  dataType: "json",
			  data: json,
			  contentType :"application/json; charset=UTF-8",
			  headers:{
	              "Access-Control-Allow-Origin": "*"
			  },
			  url : "/transfer_tpl",
			  success : function(data){
				  if(data.result.result == "failed"){
					  $("#transfer_tpl_result_div span").html("<font color='red'>failed."+data.result.message+"</font>");
				  }else{
					  $("#transfer_tpl_result_div span").html("<font color='green'>transfer success</font>");
					  $("#transfer_tpl_txid").val(data.result.txid);
				  }
			  },
			  error : function(data){
				  $("#transfer_tpl_result_div span").html("<font color='red'>Withdrawal failed</font>");
				  console.log(data);
			  }
		  });
	  }
  });
  
  $("#transfer_eth_etherscan_button").click(function(e){
	  if($("#transfer_eth_txid").val() == ""){
		  alert("There is no withdrawal information for the ethereum.");
		  $("#transfer_eth_txid").focus();
	  }else if($("#transfer_eth_txid").val().substring(0,2) != "0x"){
		  alert("Please check txid. txid starts with '0x'.");
	  }else{
		  window.open("https://etherscan.io/tx/"+$("#transfer_eth_txid").val());
	  }
  });
  
  $("#transfer_tpl_etherscan_button").click(function(e){
	  if($("#transfer_tpl_txid").val() == ""){
		  alert("There is no withdrawal information for the ethereum.");
		  $("#transfer_tpl_txid").focus();
	  }else if($("#transfer_tpl_txid").val().substring(0,2) != "0x"){
		  alert("Please check txid. txid starts with '0x'.");
	  }else{
		  window.open("https://etherscan.io/tx/"+$("#transfer_tpl_txid").val());
	  }
  });
  
  $("#transaction_list_button").click(function(e){
	  if($("#account").val() == ""){
		  alert("This service requires an account.");
		  $("#account").focus();
	  }else{
		  window.open("https://etherscan.io/address/"+$("#account").val());
	  }
  });
  
  $("#findidname").keydown(function(e){
	 if(e.keyCode == 13){
		 $("#findidbutton").trigger("click");
	 } 
  });
  
  $("#findpwname").keydown(function(e){
	 if(e.keyCode == 13){
		 $("#sendbutton").trigger("click");
	 } 
  });
  
  $("#confirmPW").keydown(function(e){
		 if(e.keyCode == 13){
			 $("#changepwbutton").trigger("click");
		 } 
	  });
  
  function refresh(){
	  $("#ether").val("");
	  $("#tpl").val("");
	  $("#result_text span").text("");
	  $("#eth_txid").val("");
	  $("#tpl_txid").val("");
	  $("#find_id_page").find("input").val("");
	  $("#find_pw_page").find("input").val("");
	  $("#change_pw_page").find("input").val("");

	  document.getElementById("contactForm").reset();
  }
  
  function hideall(){
	  $("#sale_page").hide();
	  $("#login_page").hide();
	  $("#register_page").hide();
	  $("#wallet_page").hide();
	  $("#find_id_page").hide();
	  $("#find_pw_page").hide();
	  $("#change_pw_page").hide();
	  
	  refresh();
  }
  
  function ajaxcall(url, param, success, failed){
	  $.ajax({
		  type: "POST",
		  dataType: "json",
		  data: param,
		  contentType :"application/json; charset=UTF-8",
		  headers:{
              "Access-Control-Allow-Origin": "*"
		  },
		  url : url,
		  success : function(data){
			  success(data);
		  },
		  error : function(data){
			  failed(data);
		  }
	  });
  }
  
  $(document).on('ready',function(){
	  $('#createAccountForm').validator();
  });

})(jQuery); // End of use strict
