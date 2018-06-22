package com.banco.trade.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.banco.trade.service.serviceImpl;

@Controller
public class controller {
	
	@Autowired
	
	serviceImpl service;


	@RequestMapping("/")
	public String index(Model model) {
		model.addAttribute("name", "SpringBlog from Millky");
		return "main";
	}
	
	@RequestMapping(value = "/currency", method = RequestMethod.POST)
	public ModelAndView currency() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result", service.currency());
		return mv;
	}
	
	@RequestMapping(value = "/getmarketsummaries", method = RequestMethod.POST)
	public ModelAndView getmarketsummaries() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result", service.getmarketsummaries());
		return mv;
	}
	
	@RequestMapping(value = "/config", method = RequestMethod.GET)
	public ModelAndView config() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		System.out.println("/config");
		mv.addAllObjects(service.config());
		
		return mv;
	}
	
	@RequestMapping(value = "/time", method = RequestMethod.GET)
	public ModelAndView time() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		System.out.println("/time");
		
		long unixTime = System.currentTimeMillis() / 1000L;

		mv.addObject(unixTime);
		
		return mv;
	}
	
	@RequestMapping(value = "/symbols", method = RequestMethod.GET)
	public ModelAndView symbols(@RequestParam Map<String, Object> param) {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		System.out.println("/symbols");
		mv.addAllObjects(service.symbols(param));
		return mv;
	}
	
	@RequestMapping(value = "/history", method = RequestMethod.GET)
	public ModelAndView history(@RequestParam Map<String, Object> param) {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		System.out.println("/history");
		mv.addAllObjects(service.history(param));
		return mv;
	}
	
	@RequestMapping(value = "/marks", method = RequestMethod.GET)
	public ModelAndView marks(@RequestParam Map<String, Object> param) {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		System.out.println("/marks");
		mv.addAllObjects(service.marks(param));
		return mv;
	}
	
	@RequestMapping(value = "/timescale_marks", method = RequestMethod.GET)
	public ModelAndView timescale_marks(@RequestParam Map<String, Object> param) {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		System.out.println("/timescale_marks");
		
		List<Map<String, Object>> hoot = service.timescale_marks(param);
		
		for(int i = 0; i < hoot.size(); i++){
			mv.addAllObjects(hoot.get(i));
		}
		return mv;
	}
}
