package com.kosta.deal.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.kosta.deal.entity.Sale;
import com.kosta.deal.service.SaleService;
import com.kosta.deal.util.PageInfo;



@RestController
public class SaleController {
	
	@Autowired
	private SaleService saleService;
	
	@GetMapping({"/salelist/{page}","/salelist"})  //salelist 페이지 처리
	public ResponseEntity<List<Sale>> saleList(@PathVariable(required=false) Integer page) {
		try {
			List<Sale> saleList = saleService.saleListByPage(page);		
			return new ResponseEntity<List<Sale>>(saleList, HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Sale>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/salelist/{page}/{category}")
	public ResponseEntity<List<Sale>>saleListByCategory(@PathVariable(required=false)Integer page,
			@PathVariable(required=false)String category){
		try {
			List<Sale>saleList=saleService.categoryListByPage(category,page);
			return new ResponseEntity<List<Sale>> (saleList,HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Sale>>(HttpStatus.BAD_REQUEST);
		}
	}
	@GetMapping("/salesearchlist/{page}/{keyword}")
	public ResponseEntity<List<Sale>>salesearchlist(@PathVariable(required=false)Integer page,
			@PathVariable(required=false)String keyword){
		try {
			List<Sale>saleList=saleService.salesearchlistByPage(keyword,page);
			return new ResponseEntity<List<Sale>> (saleList,HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Sale>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/saledetail/{sect}/{email}/{num}")
	public ResponseEntity<Map<String,Object>> saleDetail(@PathVariable String sect,@PathVariable String email,@PathVariable Integer num){
		try {
			Map<String,Object> res= new HashMap<>();
			res = saleService.saleInfo(num);
			if(sect.equals("only-detail")) {
				saleService.plusViewCount(num);
				Boolean heart= saleService.isHeartSale(email,num);
				res.put("heart", heart);
			}else if(sect.equals("after-modify")) {
				Boolean heart=saleService.isHeartSale(email,num);
				res.put("heart", heart);
			}
			return new ResponseEntity<Map<String,Object>> (res,HttpStatus.OK);
		}catch(Exception e){
			e.printStackTrace();
			return new ResponseEntity<Map<String,Object>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/saledetail/{sect}/{num}")
	public ResponseEntity<Map<String,Object>> saleDetail(@PathVariable String sect,@PathVariable Integer num){
		try {
			Map<String,Object> res= new HashMap<>();
			res = saleService.saleInfo(num);
			if(sect.equals("only-detail")) {
				saleService.plusViewCount(num);
			}
			return new ResponseEntity<Map<String,Object>> (res,HttpStatus.OK);
		}catch(Exception e){
			e.printStackTrace();
			return new ResponseEntity<Map<String,Object>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	//채팅창에서 사용
	@GetMapping("/saledetail/{num}")
	public ResponseEntity<Sale> saleDetail(@PathVariable Integer num){
		try {
			Sale sale = saleService.saleDetail(num);
			return new ResponseEntity<Sale> (sale,HttpStatus.OK);
		}catch(Exception e){
			e.printStackTrace();
			return new ResponseEntity<Sale>(HttpStatus.BAD_REQUEST);
		}
	}
	@PostMapping("/salewrite")
	public ResponseEntity<Integer> saleWrite(@ModelAttribute Sale sale,List<MultipartFile> file) {
		
		try {
			
			sale.setStatus("판매중");
			Integer num=saleService.saleWrite(sale, file);
			return new ResponseEntity<Integer>(num,HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
		}
		
	}
	@GetMapping("/salemodify/{num}")
	public  ResponseEntity<Sale> saleModify(@PathVariable Integer num) {
		try {
			Sale sale = saleService.saleDetail(num);
			return new ResponseEntity<Sale>(sale,HttpStatus.OK);
			
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Sale>(HttpStatus.BAD_REQUEST);
		}
		
		
	}
	@PostMapping("/salemodify")
	public ResponseEntity<Integer> saleModify(@ModelAttribute Sale sale,@RequestParam(value="file",required=false)List<MultipartFile>file){
		try {
			Integer num =saleService.saleModify(sale,file);
			return new ResponseEntity<Integer>(num,HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/salelike/{email}/{num}")
	public ResponseEntity<Map<String,Object>> saleLike(@PathVariable String email,@PathVariable Integer num){
		try {
			Map<String,Object> res= new HashMap<>();
			Boolean selectSale=saleService.selHeartSale(email, num);
			res.put("isSelect", selectSale);
			Integer zzimCnt = saleService.saleDetail(email,num).getZzimcnt();
			res.put("zzimCnt", zzimCnt);
			return new ResponseEntity<Map<String,Object>>(res,HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String,Object>>(HttpStatus.BAD_REQUEST);
		}
		
		
		
	}
	@DeleteMapping("/saledelete/{num}")
	public ResponseEntity<Integer>saleDelete(@PathVariable Integer num){
		try {
			saleService.saleDelete(num);
			return new ResponseEntity<Integer>(num,HttpStatus.OK);
			
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/img/{num}")
	public void imageView(@PathVariable Integer num,HttpServletResponse response){
		try {
			saleService.readImage(num, response.getOutputStream());
			
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/changesalestatus/{num}/{status}")
	public ResponseEntity<String> changesalestatus(@PathVariable Integer num, @PathVariable String status){
		try {
			saleService.changesalestatus(num,status);
			return new ResponseEntity<String>("상태변경 성공",HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/hotsalelist")
	public ResponseEntity<List<Sale>> hotsalelist() {
		try {
			List<Sale> saleList = saleService.hotsalelist();		
			return new ResponseEntity<List<Sale>>(saleList, HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Sale>>(HttpStatus.BAD_REQUEST);
		}
	}
}