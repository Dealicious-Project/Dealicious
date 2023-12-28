package com.kosta.deal.service;


import java.util.Date;
import java.util.List;
import java.util.Map;

import com.kosta.deal.entity.Admin;

public interface AdminService {
	Admin login(String adminid, String password) throws Exception;
	void changeadminpassword(String adminid, String currentpassword, String changepassword1) throws Exception;
	List<Map<String,Object>> payList(String status) throws Exception;
	void settle(List<String> settlenum) throws Exception;
	List<Map<String,Object>> settleList(Date startDate,Date endDate) throws Exception;
	boolean checkadminid(String adminid) throws Exception;
	void registerAccountId(String accountid, String bank) throws Exception;
}
