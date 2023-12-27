package com.kosta.deal.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.kosta.deal.config.auth.PrincipalDetails;
import com.kosta.deal.entity.Hot;
import com.kosta.deal.entity.Keyword;
import com.kosta.deal.entity.Notification;
import com.kosta.deal.entity.User;
import com.kosta.deal.service.NotiService;

@RestController
public class NotiController {
	
	@Autowired
	private NotiService notiService;
	
	@GetMapping("/hotlist")
	public ResponseEntity<List<Hot>> hotlist() {
		List<Hot> hotlist;
		try {
			hotlist = notiService.getHotList();
			return new ResponseEntity<List<Hot>>(hotlist, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Hot>>( HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/search/{keyword}")
	public ResponseEntity<String> search(@PathVariable String keyword) {
		try {
			notiService.addKeyword(keyword);
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/noticnt")
	public ResponseEntity<Integer> noticnt(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			Integer cnt = notiService.findNotiCnt(user.getEmail());
			return new ResponseEntity<Integer>(cnt,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notiactivity")
	public ResponseEntity<List<Notification>> notiactivity(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			List<Notification> notilist = notiService.findNotiActiList(user.getEmail());
			return new ResponseEntity<List<Notification>>(notilist,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Notification>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notikeyword")
	public ResponseEntity<List<Map<String, Object>>> notikeyword(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			List<Map<String, Object>> notilist = notiService.findNotiKeywordList(user.getEmail());
			return new ResponseEntity<List<Map<String, Object>>>(notilist,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Map<String, Object>>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/keywordlist")
	public ResponseEntity<List<Keyword>> keywordlist(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			List<Keyword> keywordlist = notiService.findKeywordList(user.getEmail());
			return new ResponseEntity<List<Keyword>>(keywordlist,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Keyword>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/registerkeyword/{keyword}")
	public ResponseEntity<Keyword> registerkeyword(Authentication authentication, @PathVariable String keyword) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			Keyword keyword1 = new Keyword();
			keyword1.setContent(keyword);
			keyword1.setEmail(user.getEmail());
			notiService.registerkeyword(keyword1);
			return new ResponseEntity<Keyword>(keyword1,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Keyword>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/deletekeyword")
	public ResponseEntity<String> deletekeyword(Authentication authentication, @RequestBody Keyword keyword) {
		try {
//			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
//			User user = principalDetails.getUser();
			notiService.deletekeyword(keyword);
			return new ResponseEntity<String>("키워드 삭제완료",HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notiacticnt")
	public ResponseEntity<Integer> notiacticnt(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			Integer cnt = notiService.findNotiActiCnt(user.getEmail());
			return new ResponseEntity<Integer>(cnt,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notikeycnt")
	public ResponseEntity<Integer> notikeycnt(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			Integer cnt = notiService.findNotiKeyCnt(user.getEmail());
			return new ResponseEntity<Integer>(cnt,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notieachcnt")
	public ResponseEntity<Map<String,Object>> notieachcnt(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			Map<String,Object> res = notiService.findNotiEachCnt(user.getEmail());
			return new ResponseEntity<Map<String,Object>>(res,HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String,Object>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notiactivityread")
	public ResponseEntity<String> notiactivityread(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			notiService.notiactivityread(user.getEmail());
			return new ResponseEntity<String>("활동 읽음 처리",HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notikeywordread")
	public ResponseEntity<String> notikeywordread(Authentication authentication) {
		try {
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			User user = principalDetails.getUser();
			notiService.notikeywordread(user.getEmail());
			return new ResponseEntity<String>("키워드 읽음 처리",HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
}
