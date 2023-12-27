package com.kosta.deal.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.deal.config.auth.PrincipalDetails;
import com.kosta.deal.entity.EmailCode;
import com.kosta.deal.entity.User;
import com.kosta.deal.repository.EmailCodeRepository;
import com.kosta.deal.repository.UserRepository;
import com.kosta.deal.service.UserListService;
import com.kosta.deal.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class RestApiController {
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final UserService userService;
	private final UserListService userListService;
	private final EmailCodeRepository emailCodeRepository;

	//로그인 후 user정보 불러와서 redux에 넣는용도
	@GetMapping("user")
	public ResponseEntity<User> user(Authentication authentication) {
		PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
		userListService.add(principalDetails.getUser());
		return new ResponseEntity<User>(principalDetails.getUser(), HttpStatus.OK);
	}
	
	//마이페이지에서 페이지 로드할때마다 별점 새로 계산하려고
	@GetMapping("user1")
	public ResponseEntity<User> user1(Authentication authentication) {
		PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
		return new ResponseEntity<User>(principalDetails.getUser(), HttpStatus.OK);
	}

	@PutMapping("profilemodify")
	public ResponseEntity<User> updateUser(@ModelAttribute User updatedUser, MultipartFile file) throws Exception {
		User currentUser = userService.findUserByEmail(updatedUser.getEmail());
		currentUser.setNickname(updatedUser.getNickname());
		currentUser.setAccountbank(updatedUser.getAccountbank());
		currentUser.setAccountid(updatedUser.getAccountid());
		userService.uploadProfileimg(currentUser, file);
		userRepository.save(currentUser);

		return new ResponseEntity<>(currentUser, HttpStatus.OK);
	}

	@GetMapping("manager/reports")
	public String reports() {
		return "reports";
	}

	@GetMapping("admin/users")
	public List<User> users() {
		return userRepository.findAll();
	}

	@PostMapping("join")
	public String join(@RequestBody User user, Authentication authentication) {
		if (authentication == null) {
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
			user.setRoles("ROLE_USER");
			user.setUsername(user.getName());
			userRepository.save(user);
			EmailCode emailCode = emailCodeRepository.findByEmail(user.getEmail()).get();
			emailCodeRepository.delete(emailCode);

		} else {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User auser = User.builder().id(principalDetails.getUser().getId())
					.provider(principalDetails.getUser().getProvider())
					.providerId(principalDetails.getUser().getProviderId())
					.socialemail(principalDetails.getUser().getSocialemail())
					.createDate(principalDetails.getUser().getCreateDate()).roles(principalDetails.getUser().getRoles())
					.username(principalDetails.getUser().getUsername()).name(user.getName()).email(user.getEmail())
					.nickname(user.getNickname()).password(bCryptPasswordEncoder.encode(user.getPassword()))
					.tel(user.getTel()).type(user.getType()).typename(user.getTypename()).build();
			userRepository.save(auser);
			EmailCode emailCode = emailCodeRepository.findByEmail(user.getEmail()).get();
			emailCodeRepository.delete(emailCode);
		}
		
		return "회원가입완료";
	}

	// 비밀번호 변경 엔드포인트
	@PutMapping("changepassword")
	public ResponseEntity<String> changePassword(@RequestBody Map<String, Object> request,
			Authentication authentication) {
		if (authentication == null) {
			return new ResponseEntity<>("로그인이 필요합니다.", HttpStatus.UNAUTHORIZED);
		}
		PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
		User currentUser = principalDetails.getUser();
		String currentPassword = (String) request.get("currentPassword");
		String newPassword = (String) request.get("newPassword");
		String confirmNewPassword = (String) request.get("confirmNewPassword");

		if (!bCryptPasswordEncoder.matches(currentPassword, currentUser.getPassword())) {
			return new ResponseEntity<>("현재 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
		}

		if (!newPassword.equals(confirmNewPassword)) {
			return new ResponseEntity<>("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
		}

		currentUser.setPassword(bCryptPasswordEncoder.encode(newPassword));
		userRepository.save(currentUser);

		return new ResponseEntity<>("비밀번호가 성공적으로 변경되었습니다.", HttpStatus.OK);
	}

	@GetMapping("/nicknamecheck/{nickname}")
	public ResponseEntity<Boolean> nicknamecheck(@PathVariable String nickname) {
		try {
			Boolean res = userService.checkNickname(nickname);
			return new ResponseEntity<Boolean>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/emails/verification-requests")
	public ResponseEntity<String> sendMessage(@RequestBody Map<String, Object> param) throws Exception {
			String email = (String) param.get("email");
			userService.sendCodeToEmail(email);
			return new ResponseEntity<String>(HttpStatus.OK);

	}

	@PostMapping("/emails/verifications")
	public ResponseEntity verificationEmail(@RequestBody Map<String, Object> param) throws Exception {
			String email = (String) param.get("email");
			String authCode = (String) param.get("code");
			userService.verifiedCode(email, authCode);
			return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@GetMapping("/logout1")
	public ResponseEntity<String> logout(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			userListService.remove(principalDetails.getUser());
			return new ResponseEntity<String>("로그아웃성공", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(e.getMessage(),HttpStatus.BAD_REQUEST);
		}
	}
}
