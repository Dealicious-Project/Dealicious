package com.kosta.deal.service;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.kosta.deal.entity.Sale;
import com.kosta.deal.entity.User;

public interface SaleService {
	
	List<Sale> saleListByPage(Integer curPage) throws Exception;

	
	Integer saleWrite(Sale sale, List<MultipartFile> file) throws Exception;
	void plusViewCount(Integer num)throws Exception;
	
	
	Sale saleDetail(Integer num) throws Exception;
	Integer saleModify(Sale sale, List<MultipartFile> file) throws Exception;
	
	
	Map<String,Object> saleInfo(Integer num) throws Exception;
	Boolean isHeartSale(String email, Integer num) throws Exception;
	void readImage(Integer num, OutputStream out) throws Exception;
	Boolean selHeartSale(String email, Integer num)throws Exception;
	void saleDelete(Integer num) throws Exception;

	

	void changesalestatus(Integer num, String status) throws Exception;

	void payFinish(Integer num) throws Exception;

	void changesalestatusToreceipt(Integer num, String email) throws Exception;
	Sale saleDetail(String email, Integer num);


	List<Sale> categoryListByPage(String category, Integer page)throws Exception;
	List<Sale> salesearchlistByPage(String keyword, Integer page)throws Exception;
	
	List<Sale> hotsalelist() throws Exception;
	List<Sale> hotsalelistbyuser(User user) throws Exception;
	
	List<Sale> salelistbyuser(Integer page, User user) throws Exception;
	List<Sale> categorylistbyuser(String category, Integer page, User user) throws Exception;
	List<Sale> salesearchlistbyuser(String keyword, Integer page, User user) throws Exception;
}
