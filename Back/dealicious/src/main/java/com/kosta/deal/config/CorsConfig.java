package com.kosta.deal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.kosta.deal.config.jwt.JwtProperties;

@Configuration
public class CorsConfig {		//CORS:웹 애플리케이션이 다른 도메인에서 리소스를 요청할 때 발생하는 보안 정책을 관리
	
	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();//실제 CORS 설정을 담고 있는 클래스로, 여기서는 자격 증명 허용, 허용된 출처, 허용된 헤더 및 메서드
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://43.203.108.152:3000"); //Access-Control-Allow-Origin (Response에 자동으로 추가해줌)
//		config.addAllowedOrigin("*");   //이거 맞음?
		
		config.addAllowedHeader("*"); //Access-Control-Allow-Headers
		config.addAllowedMethod("*"); //Access-Control-Allow-Method
		config.addExposedHeader(JwtProperties.HEADER_STRING); //클라이언트(리액트 등)가 응답에 접근할 수 있는 Header들을 추가한다.
		source.registerCorsConfiguration("/*", config);
		source.registerCorsConfiguration("/*/*", config);
		source.registerCorsConfiguration("/*/*/*", config);//registerCorsConfiguration(): 특정 URL 패턴에 대해 CORS 설정을 등록하는 메서드
		source.registerCorsConfiguration("/*/*/*/*", config);//registerCorsConfiguration(): 특정 URL 패턴에 대해 CORS 설정을 등록하는 메서드
		return new CorsFilter(source);
	}
}
