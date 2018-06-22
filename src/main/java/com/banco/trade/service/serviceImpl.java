package com.banco.trade.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@ComponentScan("com.banco.trade")
public class serviceImpl {

	@Autowired
	serviceUtil util;
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> currency(){
		Map<String, Object> map = new HashMap<String, Object>();
		
		try{
			String result = util.sendGet("http://earthquake.kr/exchange");
			
			if (!result.startsWith("error")) {
				map = new ObjectMapper().readValue(result, HashMap.class);
			}else{
				map.put("result", "failed");
			}
		}catch(Exception e){
			map.put("result", "failed");
			e.printStackTrace();
		}
		
		return map;
	}

	public Map<String, Object> getmarketsummaries() {
		Map<String, Object> map = new HashMap<String, Object>();

		try{
			String result = util.sendGet("https://bittrex.com/api/v1.1/public/getmarketsummaries");
			
			if (!result.startsWith("error")) {
				JSONObject json = new JSONObject(result);
				JSONArray array = json.getJSONArray("result");
				for(int i = 0; i < array.length(); i++){
					map.put(array.getJSONObject(i).getString("MarketName"), array.getJSONObject(i).toString());
				}
			}else{
				map.put("result", "failed");
			}
		}catch(Exception e){
			map.put("result", "failed");
			e.printStackTrace();
		}
		
		return map;
	}

	public Map<String, Object> config() {
		// TODO Auto-generated method stub
		Map<String, Object> result = new HashMap<>();
		
		result.put("supports_search", true);
		result.put("supports_group_request", false);
		result.put("supports_marks", false);
		result.put("supports_timescale_marks", false);
		result.put("supports_time", true);
			
		result.put("exchanges", "["
				+ "{'name':'All Exchanges'}{'value':''}{''desc':''}"
				+ "]");
			
		result.put("symbols_types", "["
				+ "{'name':'All types'}{'value':''}"
				+ "{'name':'Stock'}{'value':'stock'}"
				+ "{'name':'Index'}{'value':'index'}"
				+ "{'name':'Bitcoin'}{'value':'bitcoin'}"
				+ "{'name':'Altcoin'}{'value':'altcoin'}"
				+ "]");
		
		
		result.put("supported_resolutions", new String[]{"5", "15", "30", "60", "1D", "1W", "1M"});
		
		return result;
	}
	
	// https://github.com/tradingview/charting_library/wiki/Symbology
	public Map<String, Object> symbols(Map<String, Object> param) {
		
		Map<String, Object> result = new HashMap<>();
		
		String symbol = param.get("symbol").toString().toUpperCase();
		String cointype = "AltCoin";
		
		if("BTC".equals(symbol)){
			cointype = "BitCoin";
		}
		
		result.put("name", symbol); //symbol 이름 (호출용, 내부) 
		result.put("exchange-traded", "KRW"); //거래소 이름
		result.put("exchange-listed", "KRW"); //거래소 이름
		result.put("timezone", "Asia/Seoul");
		
		//common price = minmov / pricescale
		result.put("minmov", 1); //1눈금에 움직일 
		result.put("minmov2", 0); //minmove2 for common prices is 0 or it can be skipped.
		result.put("pricescale", 100); //소수 자릿수를 정의 (10진수) 100 => 1.01 1000 => 1.005
		result.put("fractional", false); //fractional for common prices is false or it can be skipped. 어렵다..
		
		result.put("pointvalue", 1);
		result.put("session", "0000-2359"); // Trading hours for this symbol https://github.com/tradingview/charting_library/wiki/Trading-Sessions
		result.put("has_intraday", true); //Default: false 일간 데이터를 보여줄지.. false 는 disabled 된다 차트 중 어디인지 테스트해볼것
		result.put("has_no_volume", true);
		result.put("description", symbol);
		result.put("type", cointype);
		result.put("supported_resolutions", new String[]{"5", "15", "30", "60", "1D", "1W", "1M"});
		// resolution 이란 한 바에 표시되는 기간을 의미한다. 일간(초분시) 와 DWM (일일, 주간, 한달) 이 있다.
		// https://github.com/tradingview/charting_library/wiki/Resolution
		// 1S - one second, 2S - two seconds, 1 - one minute, 2 - two minutes, 60 - one hour, 120 - two hours, 240 - four hours.
		// 시간은 분단위로 한다. 1H (X) 60 (O)
		// DMW
		result.put("ticker", symbol);
		result.put("currency_code", "krw");
		
		return result;
	}
	
	/*
	 * @param symbol
	 * @param from
	 * @param to
	 * @param resolution (lowercase required)
	 */
	public Map<String, Object> history(Map<String, Object> param) {
		// TODO Auto-generated method stub
		Map<String, Object> result = new HashMap<>();
		
		JSONArray chartData = null;
		
		String symbol = param.get("symbol").toString();
		String from = param.get("from").toString();
		String to = param.get("to").toString();
		
		
		System.out.println("from : " + from);
		System.out.println("to"+to);
		try {
			//candlestick period in seconds; valid values are 300, 900, 1800, 7200, 14400, and 86400
			//2018/06/01~ 15분 단위
//			String charDataString = util.sendGet("https://poloniex.com/public?command=returnChartData&currencyPair=USDT_BTC&start=1514764800&end=9999999999&period=900");
			String charDataString = util.sendGet("https://min-api.cryptocompare.com/data/histohour?fsym="+symbol+"&tsym=KRW&aggregate=0&e=CCCAGG");
			
			System.out.println("https://min-api.cryptocompare.com/data/histohour?fsym="+symbol+"&tsym=KRW&aggregate=0&e=CCCAGG");
			
			if (!charDataString.startsWith("error")) {
				JSONObject temp = new JSONObject(charDataString);
				chartData = temp.getJSONArray("Data");
			}else{
				result.put("error", charDataString);
			}
			
		} catch (Exception e) {
			result.put("error", e.getMessage());
			e.printStackTrace();
		}
		
		String[] t = new String[chartData.length()];
		String[] c = new String[chartData.length()];
		String[] o = new String[chartData.length()];
		String[] h = new String[chartData.length()];
		String[] l = new String[chartData.length()];
		String[] v = new String[chartData.length()];
		
		//"date":1514764800,"high":13799.99999984,"low":13210.99999982,"open":13799.99999984,"close":13369.40498774,"volume":13287941.068822,"quoteVolume":985.49538388,"weightedAverage":13483.51426721},
		if(chartData.length() > 0){
			for(int i = 0; i < chartData.length(); i++){
				try {
					t[i] = chartData.getJSONObject(i).get("time").toString();
					c[i] = chartData.getJSONObject(i).get("close").toString();
					o[i] = chartData.getJSONObject(i).get("open").toString();
					h[i] = chartData.getJSONObject(i).get("high").toString();
					l[i] = chartData.getJSONObject(i).get("low").toString();
					v[i] = chartData.getJSONObject(i).get("volumeto").toString();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		
		result.put("s","ok"); //status ok | error | no_data
		result.put("errmsg",""); // s='error' 일때만 필수 그 외 optional
		result.put("v","nextTime"); // s='no_data' 일때만 데이터가 없을때 다음 조회 시간 세팅
		//2015년 4월 3일 16:00~19:00 데이터 요청 시 주말이거나 good friday 인 경우 data 가 없으면
		// 가장 근접한 장 마감 시간을 전달한다. =>2015년 4월 2일 18:59 GMT+0
		
		result.put("t",t); // 막대 시간 utc (unixtimestamp)
		result.put("c",c); // closing price 종가 
		result.put("o",o); // opening price 오픈가 (optional)
		result.put("h",h); // high price 고가 (optional)
		result.put("l",l); // low price 저가 (optional)
		result.put("v",v); // volume (optional)
		
		return result;
	}

	/**
	 * 
	 * @param symbol
	 * @param from
	 * @param to
	 * @param resolution
	 * 
	 * @return
	 */
	public Map<String, Object> marks(Map<String, Object> param) {
		// TODO Auto-generated method stub
		Map<String, Object> result = new HashMap<>();
		
		result.put("id", null);
		result.put("time", null);
		result.put("color", null);
		result.put("text", null);
		result.put("label", null);
		result.put("labelFontColor", null);
		result.put("minSize", null);
		
		return result;
	}

	public List<Map<String, Object>> timescale_marks(Map<String, Object> param) {
		// TODO Auto-generated method stub
		
		String now = util.getUnixTimeStamp();
		String min5 = String.valueOf((Integer.parseInt(util.getUnixTimeStamp())) - (5*60));
		String min10 = String.valueOf((Integer.parseInt(util.getUnixTimeStamp())) - (10*60));
		String min15 = String.valueOf((Integer.parseInt(util.getUnixTimeStamp())) - (15*60));
		
		List<Map<String, Object>> list = new ArrayList<>();
		
		try{
			JSONObject tsm1 = new JSONObject("{'id':'tsm1', 'time':'" + now + "', 'color':'yellow', 'label':'바나나', 'tooltip':'바나나팡'}");
			JSONObject tsm2 = new JSONObject("{'id':'tsm2', 'time':'" + min5 + "', 'color':'red', 'label':'딸기', 'tooltip':'딸기팡'}");
			JSONObject tsm3 = new JSONObject("{'id':'tsm3', 'time':'" + min10 + "', 'color':'blue', 'label':'블루베리', 'tooltip':'블루베리팡'}");
			JSONObject tsm4 = new JSONObject("{'id':'tsm4', 'time':'" + min15 + "', 'color':'purple', 'label':'포도', 'tooltip':'포도팡'}");
			list.add(util.jsonToMap(tsm1));
			list.add(util.jsonToMap(tsm2));
			list.add(util.jsonToMap(tsm3));
			list.add(util.jsonToMap(tsm4));
		}catch(Exception e){
			e.printStackTrace();
		}
		
//		String marks = "["
//				+ "{'id':'tsm1', 'time':'" + now + "', 'color':'yellow', 'label':'바나나', 'tooltip':'바나나팡'},"
//				+ "{'id':'tsm2', 'time':'" + min5 + "', 'color':'red', 'label':'딸기', 'tooltip':'딸기팡'},"
//				+ "{'id':'tsm3', 'time':'" + min10 + "', 'color':'blue', 'label':'블루베리', 'tooltip':'블루베리팡'},"
//				+ "{'id':'tsm4', 'time':'" + min15 + "', 'color':'purple', 'label':'포도', 'tooltip':'포도팡'}"
//				+ "]";
//		
//		System.out.println(marks);
//		
//		JSONArray result = null;
//		
//		try {
//			result = new JSONArray(marks);
//		} catch (JSONException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
		return list;
	}
}
