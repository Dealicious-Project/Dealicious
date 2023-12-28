package com.kosta.deal.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.kosta.deal.config.auth.PrincipalDetails;
import com.kosta.deal.entity.Admin;
import com.kosta.deal.repository.AdminRepository;
import com.kosta.deal.service.AdminService;

@RestController
public class AdminController {

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private AdminService adminService;

	@PostMapping("adminjoin")
	public String join(@RequestBody Admin adminuser) {
		Admin aadminuser = Admin.builder().adminid(adminuser.getAdminid()).admincode(adminuser.getAdmincode())
				.password(bCryptPasswordEncoder.encode(adminuser.getPassword())).roles("ROLE_ADMIN").build();
		adminRepository.save(aadminuser);
		return "회원가입완료";
	}

	@GetMapping("adminlogin")
	public ResponseEntity<Admin> admin(Authentication authentication) {
		PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
		return new ResponseEntity<Admin>(principalDetails.getAdmin(), HttpStatus.OK);
	}

	@PostMapping("/changeadminpassword")
	public ResponseEntity<String> changeadminpassword(@RequestBody Map<String, Object> param) {
		try {
			String adminid = (String) param.get("adminid");
			String currentpassword = (String) param.get("currentpassword");
			String changepassword1 = (String) param.get("changepassword1");
			adminService.changeadminpassword(adminid, currentpassword, changepassword1);
			return new ResponseEntity<String>("관리자 비밀번호 변경 성공.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/adminmain/{status}")
	public ResponseEntity<List<Map<String, Object>>> adminmain(@PathVariable String status) {
		try {
			List<Map<String, Object>> saleList = adminService.payList(status);
			return new ResponseEntity<List<Map<String, Object>>>(saleList, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Map<String, Object>>>(HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/adminsettle")
	public ResponseEntity<List<Map<String, Object>>> adminsettle() {
		try {
			List<Map<String, Object>> saleList = adminService.payList("수령완료");
			return new ResponseEntity<List<Map<String, Object>>>(saleList, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Map<String, Object>>>(HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/settle")
	public ResponseEntity<String> settle(@RequestBody Map<String, Object> param) {
		try {
			String settle = (String) param.get("data");
			String[] splitStr = settle.split(",");
			List<String> settlenum = new ArrayList<>();
			for (int i = 0; i < splitStr.length; i++) {
				settlenum.add(splitStr[i]);
			}
			adminService.settle(settlenum);
			return new ResponseEntity<String>("관리자 정산 처리 완료.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/settlelist")
	public ResponseEntity<List<Map<String, Object>>> settlelist(@RequestBody Map<String, Object> param) {
		try {
			String startDate = ((String) param.get("sdate")).substring(0, 10);
			String endDate = ((String) param.get("edate")).substring(0, 10);
			DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate startDate1 = LocalDate.parse(startDate, dateFormatter);
			DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
			LocalTime startTime = LocalTime.parse("00:00:00", timeFormatter);
			LocalDateTime startDateTime = startDate1.atTime(startTime);
			Date sdate = Date.from(startDateTime.atZone(ZoneId.systemDefault()).toInstant());

			LocalDate endDate1 = LocalDate.parse(endDate, dateFormatter);
			LocalTime endTime = LocalTime.parse("23:59:59", timeFormatter);
			LocalDateTime endDateTime = endDate1.atTime(endTime);
			Date edate = Date.from(endDateTime.atZone(ZoneId.systemDefault()).toInstant());
			System.out.println(sdate);
			System.out.println(edate);
			List<Map<String, Object>> settleList = adminService.settleList(sdate, edate);
			return new ResponseEntity<List<Map<String, Object>>>(settleList, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Map<String, Object>>>(HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/adminidcheck/{adminid}")
	public ResponseEntity<Boolean> adminidcheck(@PathVariable String adminid) {
		try {
			Boolean res = adminService.checkadminid(adminid);
			return new ResponseEntity<Boolean>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);
		}
	}
}
