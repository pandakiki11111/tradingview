<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="">
	<meta name="author" content="">
	
	<title>Trading View</title>
	
	<!-- Bootstrap core CSS -->
	<link href="/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
	
	<!-- Custom fonts for this template -->
	<link rel="stylesheet" type="text/css" href="/css/style.css" media="screen">
<!-- 	<link href="/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"> -->
<!-- 	<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css"> -->
<!-- 	<link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css"> -->
	
    <!-- Bootstrap core JavaScript -->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    
<!--     <script type="text/javascript" src="js/main.js?ver=1"></script> -->
    
    <!-- bootstrap validator -->
<!-- 	<script src="https://cdnjs.cloudflare.com/ajax/libs/1000hz-bootstrap-validator/0.11.5/validator.min.js"></script> -->

    <!-- Plugin JavaScript -->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    
    <!-- charting library -->
    <script src="js/charting_library.min.js"></script>
	<script type="text/javascript" src="js/datafeeds/udf/dist/polyfills.js"></script>
	<script type="text/javascript" src="js/datafeeds/udf/dist/bundle.js"></script>
    
<!--     <script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>
 	<script>
 	  // Initialize Firebase
 	  var config = {
 	    apiKey: "AIzaSyDrcd-bd3Wk8t8LhcfXLKOAdmY5gv-Xn0I",
 	    authDomain: "chartview-44922.firebaseapp.com",
 	    databaseURL: "https://chartview-44922.firebaseio.com",
 	    projectId: "chartview-44922",
 	    storageBucket: "",
 	    messagingSenderId: "618479292124"
 	  };
 	  firebase.initializeApp(config);
 	</script> -->
    
	<style>
		input{
				cursor: pointer;
			}
			
		@media (min-width: 0px) and (max-width: 431px) {
			<!-- 모바일 대응 시 -->
		}
		[role=button]{cursor:pointer;}
	</style>
	
	<script style="text/javascript">
	
		var usd = 0;
		
		// 천단위 콤마 함수
	    function numberWithCommas(x) {
	        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    }
	    // 숫자 외 문자열 제거 함수
	    function numberDeleteChar(x) {
	        return x.toString().replace(/[^0-9]+/g, '');
	    }

	    //환율 달러 > 원화 함수
		function usdkrw(){
			$.ajax({
	            type: 'POST',
	            url:'/currency',
	            success: function(data) {
					usd = parseFloat(data.result.USDKRW[0]);
	            	console.log('환율 : $1 = \\' + usd);
	            }
	        });			
		}
	    
	    var ranks = [];
	    
		function chart(){
			console.log("chart");
			console.log($("#tradingTable tbody tr").length);
			
			if(!($("#tradingTable tbody tr").length> 0)){
				var cap = null;
		    	var pol = null;
		    	
		    	$.get('https://api.coinmarketcap.com/v2/ticker/?convert=KRW&structure=array&limit=30', function(data){
					cap = data.data;
					$.get('https://poloniex.com/public?command=returnTicker', function(data) {
						pol = data;
						$.ajax({
							type: 'POST'
							, url: '/getmarketsummaries'
							, success: async function(data){
								
								var bit = data.result;
								var btcPrice = JSON.parse(bit['USD-BTC']).Last;
								
								var html = "";
								
								for(var i=0; i<cap.length; i++){
									var coin = cap[i];
									
									if(coin.symbol == "MIOTA") coin.symbol = "IOT";
									ranks.push(coin.symbol);
									
									var usd = 'USD-'+coin.symbol;
									var usdt = 'USDT-'+coin.symbol;
									var btc = 'BTC-'+coin.symbol;
									
									html +="<tr role='button'>";
			 			    		html += "<td>" + coin.rank + "</td>";
			 			    		html += "<th scope='row'>" + coin.name + "</th>";
			 			    		html += "<td>" + parseFloat(coin.quotes.KRW.price).toLocaleString({minimumFractionDigits: 2}) + "&#8361;</td>";
			 			    		html += "<td>" + parseFloat(coin.quotes.USD.price).toLocaleString({minimumFractionDigits: 2}) + "$</td>";
			 			    		html += "<td>" + coin.quotes.KRW.percent_change_1h + "%</td>";
			 			    		html += "<td>" + coin.quotes.KRW.percent_change_24h + "%</td>";
			 			    		html += "<td>" + coin.quotes.KRW.percent_change_7d + "%</td>";
			 			    		html += "<td>" + parseFloat(coin.quotes.KRW.volume_24h).toLocaleString({minimumFractionDigits: 2}) + "&#8361;</td>";
			 			    		html += "<td>" + parseFloat(coin.quotes.KRW.market_cap).toLocaleString({minimumFractionDigits: 2}) + "&#8361;</td>";
		
			 			    		if(bit[usd] !=undefined){
			 			    			var obj = JSON.parse(bit[usd]);
			 			    			html += "<td bgcolor='orange'>" + obj.Last +" usd</td>";	
			 			    			html += "<td bgcolor='orange'>" + obj.High +" usd</td>";	
			 			    			html += "<td bgcolor='orange'>" + obj.Low +" usd</td>";
			 			    			html += "<td bgcolor='orange'>" + obj.PrevDay +" usd</td>";
			 			    		}else if(bit[usdt] !=undefined){
			 			    			var obj = JSON.parse(bit[usdt]);
			 			    			html += "<td bgcolor='orange'>" + obj.Last +" usdt</td>";	
			 			    			html += "<td bgcolor='orange'>" + obj.High +" usdt</td>";	
			 			    			html += "<td bgcolor='orange'>" + obj.Low +" usdt</td>";
			 			    			html += "<td bgcolor='orange'>" + obj.PrevDay +" usdt</td>";
			 			    		}else if(bit[btc] !=undefined){
			 			    			var obj = JSON.parse(bit[btc]);
			 			    			html += "<td bgcolor='orange'>" + obj.Last +" btc</td>";	
			 			    			html += "<td bgcolor='orange'>" + obj.High +" btc</td>";	
			 			    			html += "<td bgcolor='orange'>" + obj.Low +" btc</td>";
			 			    			html += "<td bgcolor='orange'>" + obj.PrevDay +" btc</td>";	
			 			    		}else if(pol['USDT_'+coin.symbol] != undefined){
			 			    			html += "<td bgcolor='#F781F3'>" + pol['USDT_'+coin.symbol]['last'] +" usdt</td>";	
			 			    			html += "<td bgcolor='#F781F3'>" + pol['USDT_'+coin.symbol]['high24hr'] +" usdt</td>";	
			 			    			html += "<td bgcolor='#F781F3'>" + pol['USDT_'+coin.symbol]['low24hr'] +" usdt</td>";
			 			    			html += "<td bgcolor='#F781F3'>/</td>";	
			 			    		}else if(pol['BTC_'+coin.symbol] != undefined){
			 			    			html += "<td bgcolor='#F781F3'>" + pol['BTC_'+coin.symbol]['last'] +" btc</td>";
			 			    			html += "<td bgcolor='#F781F3'>" + pol['BTC_'+coin.symbol]['high24hr'] +" btc</td>";	
			 			    			html += "<td bgcolor='#F781F3'>" + pol['BTC_'+coin.symbol]['low24hr'] +" btc</td>";
			 			    			html += "<td bgcolor='#F781F3'>/</td>";	
			 			    		}else{
			 			    			var url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+coin.symbol+'&tsyms=KRW';
			 			    			await $.get(url, function(data){
			 			    				if(data.Response == "Error"){
			 			    					html += "<td></td>";
			 			    					html += "<td></td>";
			 			   		    			html += "<td></td>";
			 			   		    			html += "<td></td>";
			 			    				}else{
			 			    					var sym = Object.keys(data.DISPLAY)[0].toString();
			 			    					var display = data.DISPLAY[sym].KRW;
			 			    					html += "<td bgcolor='#2E9AFE'>"+display.PRICE+"</td>";
			 			    					html += "<td bgcolor='#2E9AFE'>"+display.HIGH24HOUR+"</td>";
			 			   		    			html += "<td bgcolor='#2E9AFE'>"+display.LOW24HOUR+"</td>";
			 			   		    			html += "<td bgcolor='#2E9AFE'>"+display.OPENDAY+"</td>";
			 			    				}
			 			    			});
			 			    		}
									html += "<td>" + coin.symbol + "</td>";
			 			    		html += "</tr>";
								}
		 		    			$("#tradingTable tbody").append(html);
							}
						});
					});
		    	});
			}
		}
		
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
		
		$(document).ready(function () {
			$('#tradingTable').on('click', 'tr', function (event) {
				console.log($(this).children("td:last").text());
				if($(this).hasClass("open")){
					if($(this).next('tr').hasClass("graph")){
						$(this).next('tr').remove();
					}
					$(this).removeClass("open");
				}else if($(this).hasClass("graph")){
					//event.stopPropagation();
				}else{
					$("#tradingTable tr.open").next("tr").remove();
					$(this).addClass("open");
					$(this).after("<tr class='graph'><td></td><td colspan=13><div style='width:100%; overflow-x:hidden;' id='viewContainer'><script>new TradingView.widget({debug: true, fullscreen: false, symbol: '"+$(this).children("td:last").text()+"',interval: '6',container_id: 'viewContainer', datafeed: new Datafeeds.UDFCompatibleDatafeed('http://172.30.1.19:8080'), library_path: 'charting_library/', locale: getParameterByName('lang') || 'ko', drawings_access: { type: 'black', tools: [ { name: 'Regression Trend' } ] },disabled_features: ['use_localstorage_for_settings'],enabled_features: ['study_templates'],charts_storage_api_version: '1.1', client_id: 'tradingview.com', user_id: 'pandakiki'})<\/script></div></td></tr>");
				}
			});
		});
		
	    (function(){
	    	chart();
// 	        setInterval("chart()", 6000); //6초
	    })();
	    
	    //tradingview example
// 		TradingView.onready(function(){
// 			var widget = window.tvWidget = new TradingView.widget({
// 				debug: true, // uncomment this line to see Library errors and warnings in the console
// 				fullscreen: true,
// 				symbol: 'BTC',
// 				interval: '1000',
// 				container_id: "viewContainer",
// 			//	BEWARE: no trailing slash is expected in feed URL
// 				datafeed: new Datafeeds.UDFCompatibleDatafeed("http://localhost:8080"),
// 				library_path: "charting_library/",
// 				locale: getParameterByName('lang') || "ko",
// 				//	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
// 				drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
// 				disabled_features: ["use_localstorage_for_settings"],
// 				enabled_features: ["study_templates"],
// 		              charts_storage_api_version: "1.1",
// 				client_id: 'tradingview.com',
// 				user_id: 'pandakiki'
// 			});
// 		});
	     
	    // 폴로닉스 함수
        // https://poloniex.com/support/api/
// 	    function poloniex(){
// 	        $.get('https://poloniex.com/public?command=returnTicker', function(data) {
// 	        	make_data(data);
// 	        });
// 	    }
		
	 	// https://coinmarketcap.com/ko/api/
// 		function coinmarketcap(){
// 			$.get('https://api.coinmarketcap.com/v2/ticker/?convert=KRW&structure=array&limit=30', function(data){
// 				make_data(data.data);
// 			});
// 		}

		//비트렉스
		//https://support.bittrex.com/hc/en-us/articles/115003723911
// 		function bittrex(){
// 			$.get('https://bittrex.com/api/v1.1/public/getmarketsummaries', function(data){
// 				make_data(data);
// 			});
// 		}

		//크립토컴페어 
// 		function cryptocompare(){
// 			$.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=KRW', function(data){
// 				make_data(data);
// 			});
// 		}
	    
	</script>
</head>
<body>
	<div id="tv_chart_container"></div>
	<div id="content">
		<table class="table table-bordered" id="tradingTable">
			<thead class="thead-dark">
				<tr>
					<th scope="col">순위</th>
					<th scope="col">코인네임</th>
					<th scope="col">시세(&#8361;)</th>
					<th scope="col">시세($)</th>
					<th scope="col">1h change</th>
					<th scope="col">24h change</th>
					<th scope="col">7d change</th>
					<th scope="col">24h volume</th>
					<th scope="col">시세총액</th>
					<th scope="col">시세(API별)</th>
					<th scope="col">고</th>
					<th scope="col">저</th>
					<th scope="col">종</th>
					<th scope="col">symbol</th>
				</tr>
			</thead>
			<tbody>
				
			</tbody>
		</table>
	</div>
</body>
</html>