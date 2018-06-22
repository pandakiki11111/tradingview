package com.banco.trade;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootConfiguration
@Configuration
@EnableWebMvc
public class Configration implements WebMvcConfigurer {
	@Override
	public void addResourceHandlers(final ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
	    registry.addResourceHandler("/js/**").addResourceLocations("/WEB-INF/js/");
	    registry.addResourceHandler("/css/**").addResourceLocations("/WEB-INF/css/");
	    registry.addResourceHandler("/vendor/**").addResourceLocations("/WEB-INF/vendor/");
	    registry.addResourceHandler("/img/**").addResourceLocations("/WEB-INF/img/");
	    registry.addResourceHandler("/file/**").addResourceLocations("/WEB-INF/file/");
	    registry.addResourceHandler("/charting_library/**").addResourceLocations("/WEB-INF/charting_library/");
	}
	
	@Bean
	public ViewResolver getViewResolver(){
	    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
	    resolver.setPrefix("/WEB-INF/jsp/");
	    resolver.setSuffix(".jsp");
	    resolver.setViewClass(JstlView.class);
	    return resolver;
	}
	
	@Bean
    MappingJackson2JsonView jsonView(){
        return new MappingJackson2JsonView();
    }
	
//	@Bean
//    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
//        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new DateTimeModule());
//        jsonConverter.setObjectMapper(objectMapper);
//
//        return jsonConverter;
//    }
}
