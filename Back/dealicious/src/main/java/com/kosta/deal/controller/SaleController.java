package com.kosta.deal.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;



import com.kosta.deal.entity.Sale;
import com.kosta.deal.service.SaleService;



@RestController
public class SaleController {
	
	@Autowired
	private SaleService saleService;
	
	
	@GetMapping("/salelist/{category}")
	public ResponseEntity<Sale> saleList(@PathVariable(required=false) String category){
		try {
			List<Sale> saleList= saleService.saleList(category);
			return new ResponseEntity<Sale> (HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Sale>(HttpStatus.BAD_REQUEST);
		}
		
		
	}
	@GetMapping("/saledetail/{sect}/{num}")
	public ResponseEntity<Map<String,Object>> saleDetail(@PathVariable String sect,@PathVariable Integer num){
		try {
			Map<String,Object> res= new HashMap<>();
			Sale sale = saleService.saleDetail(num);
			res.put("sale", sale);
			if(sect.equals("only-detail")) {
				saleService.plusViewCount(num);
				Boolean heart= saleService.isSelectedSaleLike("lubby",num);
				res.put("heart", heart);
			}else if(sect.equals("after-modify")) {
				Boolean heart=saleService.isSelectedSaleLike("lubby",num);
				res.put("heart", heart);
			}
			return new ResponseEntity<Map<String,Object>> (res,HttpStatus.OK);
		}catch(Exception e){
			e.printStackTrace();
			return new ResponseEntity<Map<String,Object>>(HttpStatus.BAD_REQUEST);
		}
	}
	@PostMapping("/salewrite")
	public ResponseEntity<Integer> saleWrite(@ModelAttribute Sale sale,List<MultipartFile> file) {
		
		try {
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
	
	@GetMapping("/salelike/{num}")
	public ResponseEntity<Map<String,Object>> saleLike(@PathVariable Integer num){
		try {
			Map<String,Object> res= new HashMap<>();
			Boolean selectSale=saleService.selHeartSale("lubby", num);
			res.put("isSelect", selectSale);
			Integer likeCount = saleService.saleDetail(num).getLikecount();
			res.put("likeCount", likeCount);
			return new ResponseEntity<Map<String,Object>>(res,HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String,Object>>(HttpStatus.BAD_REQUEST);
		}
		
		
		
	}
	
	
	
}