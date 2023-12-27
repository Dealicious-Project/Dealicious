package com.kosta.deal.repository;



import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kosta.deal.entity.Sale;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
	Page<Sale>findByTitleContains(String title,PageRequest pageRequest);
	Page<Sale>findByContentContains(String content,PageRequest pageRequest);
	Page<Sale>findByCategoryContains(String category,PageRequest pageRequest);
	Page<Sale>findByAmountContains(String amount,PageRequest pageRequest);
	Page<Sale>findByPlaceContains(String place,PageRequest pageRequest);
	Page<Sale>findByGgullContains(String ggull,PageRequest pageRequest);
	Page<Sale>findByFileurlContains(String fileurl,PageRequest pageRequest);
	Sale findByNum(Integer num);
	List<Sale> findByEmail(String email);
	List<Sale> findByNumIn(List<Integer> numList);
	Page<Sale>findByCheckdelete(String checkdelete, PageRequest pageRequest);
	Page<Sale>findByCategoryAndCheckdelete(String category, String checkdelete, PageRequest pageRequest);
}
