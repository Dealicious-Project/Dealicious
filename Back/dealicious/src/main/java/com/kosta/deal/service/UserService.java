package com.kosta.deal.service;

import org.springframework.web.multipart.MultipartFile;

import com.kosta.deal.entity.User;

public interface UserService {
	User login(String email, String password) throws Exception;
	boolean checkNickname(String nickname) throws Exception;
	void uploadProfileimg(User user, MultipartFile file) throws Exception;
	User findUserByEmail(String email) throws Exception;
	void sendCodeToEmail(String toEmail) throws Exception;
	void verifiedCode(String email, String authCode) throws Exception;
	String createCode() throws Exception;
	void registerReview(String userEmail, String partnerEmail, String startCnt,Integer salenum) throws Exception;
}
