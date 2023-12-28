package com.kosta.deal.service;



import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kosta.deal.entity.Admin;
import com.kosta.deal.entity.AdminAccount;
import com.kosta.deal.entity.Pay;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.repository.AdminAccountRepository;
import com.kosta.deal.repository.AdminRepository;
import com.kosta.deal.repository.DslRepository;
import com.kosta.deal.repository.PayRepository;
import com.kosta.deal.repository.SaleRepository;
import com.querydsl.core.Tuple;

@Service
public class AdminServiceImpl implements AdminService{
	@Autowired
	private AdminRepository adminRepository;
	@Autowired
	private SaleRepository saleRepository;
	@Autowired
	private PayRepository payRepository;
	@Autowired
	private AdminAccountRepository adminAccountRepository;
	
	@Autowired
	private DslRepository dslRepository;

	@Override
	public Admin login(String adminid, String password) throws Exception {
		Optional<Admin> oadmin = adminRepository.findByAdminid(adminid);
		if(oadmin.isEmpty()) throw new Exception("아이디 오류");
		Admin admin = oadmin.get();
		if(!admin.getPassword().equals(password)) throw new Exception("비밀번호 오류");
		return admin;
	}

	@Override
	public void changeadminpassword(String adminid, String currentpassword, String changepassword1) throws Exception {
		Admin admin = adminRepository.findByAdminid(adminid).get();
		if(!admin.getPassword().equals(currentpassword)) throw new Exception("현재 비밀번호 오류");
		admin.setPassword(changepassword1);
		adminRepository.save(admin);
	}

	@Override
	public List<Map<String, Object>> payList(String status1) throws Exception {
		List<Map<String, Object>> res = new ArrayList<>();;
		if(status1.equals("all")) {
			List<Tuple> tupleList = dslRepository.findAllPayList();
			for(Tuple t: tupleList) {
				Integer paynum = t.get(0,Integer.class);
				String status = t.get(1,String.class);
				String title = t.get(2,String.class);
				String amount = t.get(3,String.class);
				Map<String, Object> map = new HashMap<>();
				map.put("paynum",paynum);
				map.put("status", status);
				map.put("title", title);
				map.put("amount", amount);
				res.add(map);
			}
		} else {
			List<Tuple> tupleList = dslRepository.findStatusPayList(status1);
			for(Tuple t: tupleList) {
				Integer paynum = t.get(0,Integer.class);
				String status = t.get(1,String.class);
				String title = t.get(2,String.class);
				String amount = t.get(3,String.class);
				Map<String, Object> map = new HashMap<>();
				map.put("paynum",paynum);
				map.put("status", status);
				map.put("title", title);
				map.put("amount", amount);
				res.add(map);
			}
		}
		return res;
	}

	@Override
	public void settle(List<String> settlenum) throws Exception {
		int totalAmount = 0;
		for(String s: settlenum) {
			Pay pay = payRepository.findById(Integer.parseInt(s)).get();
			Sale sale = saleRepository.findById(pay.getSalenum()).get();
			sale.setStatus("거래완료");
			totalAmount += Integer.parseInt(sale.getAmount());
			saleRepository.save(sale);
		}
		AdminAccount adminAccount = adminAccountRepository.findById("12345-12345").get();
		adminAccount.setBalance(adminAccount.getBalance()-totalAmount);
		adminAccountRepository.save(adminAccount);
		
	}

	@Override
	public List<Map<String, Object>> settleList(Date startDate, Date endDate) throws Exception {
		List<Map<String, Object>> res = new ArrayList<>();;
//		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
//		long milliSeconds = format.parse(startDate).getTime();
//		Date sDate = new Date(milliSeconds);
//		long milliSeconds2 = format.parse(endDate).getTime();
//		Date eDate = new Date(milliSeconds2);

		List<Tuple> tupleList = dslRepository.findSettleList(startDate,endDate);
		for(Tuple t: tupleList) {
			Integer paynum = t.get(0,Integer.class);
			String status = t.get(1,String.class);
			String title = t.get(2,String.class);
			String amount = t.get(3,String.class);
			Map<String, Object> map = new HashMap<>();
			map.put("paynum",paynum);
			map.put("status", status);
			map.put("title", title);
			map.put("amount", amount);
			res.add(map);
		}
		return res;
	}

	@Override
	public boolean checkadminid(String adminid) throws Exception {
		boolean checkadminid = adminRepository.existsByAdminid(adminid);
		if(checkadminid) {
			return false;
		} return true;
	}

	@Override
	public void registerAccountId(String accountid, String bank) throws Exception {
		AdminAccount adminAccount =new AdminAccount(accountid,bank,0);
		adminAccountRepository.save(adminAccount);
	}

}
