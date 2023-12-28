package com.kosta.deal.controller;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kosta.deal.entity.Pay;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.service.PayService;
import com.kosta.deal.service.PaymentService;
import com.kosta.deal.service.SaleService;

@RestController
public class PayController {

	@Autowired
	private PayService payService;

	@Autowired
	private SaleService saleService;

	@Autowired
	private PaymentService paymentService;

	@GetMapping("/gpay/{num}")
	public ResponseEntity<Sale> Gpay(@PathVariable Integer num) {
		try {
			Sale sale = saleService.saleDetail(num);
			return new ResponseEntity<Sale>(sale, HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Sale>(HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/pay")
	public ResponseEntity<String> pay(@RequestBody Map<String, Object> param) {
		try {
			// pay 생성
			Pay pay = new Pay();
			pay.setPayAmount(Integer.parseInt(String.valueOf(param.get("amount"))));
			pay.setImp_uid((String) param.get("imp_uid"));
			pay.setSalenum(Integer.parseInt((String.valueOf(param.get("salenum")))));
			pay.setBuyerEmail((String) param.get("buyerEmail"));
			// token
			String token = paymentService.getToken();
			// 결제 완료 금액
			int amount = paymentService.paymentInfo(pay.getImp_uid(), token);
			if (amount != pay.getPayAmount()) {
				paymentService.payMentCancle(token, pay.getImp_uid(), amount, "결제 금액 오류");
				return new ResponseEntity<String>("결제 금액 오류, 결제 취소", HttpStatus.BAD_REQUEST);
			}
			payService.insertPay(pay);
			saleService.payFinish(pay.getSalenum());
			return new ResponseEntity<String>("결제가 완료되었습니다.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			try {
				String token = paymentService.getToken();
				Pay pay = new Pay();
				pay.setImp_uid((String) param.get("imp_uid"));
				int amount = paymentService.paymentInfo(pay.getImp_uid(), token);
				paymentService.payMentCancle(token, pay.getImp_uid(), amount, "어드민 계좌 입금 오류");
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/mobilepay/{num}/{email}/{amount}")
	public void mobilepay(@RequestParam(required = false) String imp_uid,
			@RequestParam(required = false) String merchant_uid, @PathVariable Integer num, @PathVariable String email,
			@PathVariable Integer amount, HttpServletResponse response) throws Exception {
		try {
			// pay 생성
			Pay pay = new Pay();
			pay.setPayAmount(amount);
			pay.setImp_uid(imp_uid);
			pay.setSalenum(num);
			pay.setBuyerEmail(email);
			// token
			String token = paymentService.getToken();
			// 결제 완료 금액
			int amount1 = paymentService.paymentInfo(pay.getImp_uid(), token);
			if (amount1 != pay.getPayAmount()) {
				paymentService.payMentCancle(token, pay.getImp_uid(), amount1, "결제 금액 오류");
				response.sendRedirect("http://localhost:3000/gpay/" + Integer.toString(num));
			}
			payService.insertPay(pay);
			saleService.payFinish(pay.getSalenum());
			response.sendRedirect("http://localhost:3000/gpay_finish/" + Integer.toString(num));
		} catch (IOException e) {
			String token = paymentService.getToken();
			int amount2 = paymentService.paymentInfo(imp_uid, token);
			paymentService.payMentCancle(token, imp_uid, amount2, "어드민 계좌 입금 오류");
			response.sendRedirect("http://localhost:3000/gpay/" + Integer.toString(num));
		}
	}

}
