package com.kosta.deal.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.kosta.deal.entity.QSale;
import com.kosta.deal.entity.QSaleLike;
import com.kosta.deal.entity.QUser;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.entity.SaleLike;
import com.kosta.deal.entity.User;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SaleDslRepository {
	
	private final JPAQueryFactory jpaQueryFactory;
	
	//salelist 페이지 쿼리문
	public List<Sale> findSaleListByPaging(PageRequest pageRequest) throws Exception {
		QSale sale= QSale.sale;
		return jpaQueryFactory.selectFrom(sale)
                .offset(pageRequest.getPageNumber() * pageRequest.getPageSize())
                .limit(pageRequest.getPageSize())
                .fetch();
	}
	
	//카테고리별 목록 쿼리문
	public List<Sale> findByCategory(String category) throws Exception {
		QSale sale= QSale.sale;
		
		return jpaQueryFactory.selectFrom(sale)
				.where(sale.category.eq(category)).fetch();
	}


	 public Long findSaleCount() throws Exception{
		 
	        return jpaQueryFactory
	                .select(QSale.sale.count())
	                .from(QSale.sale).fetchOne();
	                
	    }

	public Sale findSaleBySaleNum(Integer num) {
		QSale sale=QSale.sale;
		return jpaQueryFactory.selectFrom(sale)
				.where(sale.num.eq(num)).fetchOne();
	}

	public Tuple findUserEmailAndRolesBySaleNum(Integer num) {
		QSale sale= QSale.sale;
		QUser user= QUser.user;
		return jpaQueryFactory.select(sale,user.nickname,user.typename,user.profileimgurl,user.email, user.id)
				.from(user)
				.join(sale)
				.on(sale.email.eq(user.email))
				.where(sale.num.eq(num))
				.fetchOne();
	}

	public SaleLike findSalelike(String email, Integer num) {
		QSaleLike salelike= QSaleLike.saleLike;
		return jpaQueryFactory.select(salelike)
				.from(salelike)
				.where(salelike.userEmail.eq(email).and(salelike.saleNum.eq(num)))
				.fetchOne();
	}
	public Long findIsSalelike(String email,Integer num) throws Exception{
		QSaleLike salelike= QSaleLike.saleLike;
		return jpaQueryFactory.select(salelike.count())
				.from(salelike)
				.where(salelike.userEmail.eq(email).and(salelike.saleNum.eq(num)))
				.fetchOne();
	}

	public List<Sale> hotsalelist() throws Exception {
		QSale sale= QSale.sale;
		return jpaQueryFactory.selectFrom(sale)
				.orderBy(sale.viewcnt.desc())  // 조회수를 기준으로 내림차순 정렬
				.where(sale.checkdelete.eq("0").and(sale.status.eq("판매중")))
	            .limit(6)  // 최대 6개의 결과만 반환
	            .fetch();
	}
	
	public List<Sale> hotsalelistbyuser(User u) throws Exception {
		QSale sale= QSale.sale;
		QUser user = QUser.user;
		return jpaQueryFactory.selectFrom(sale)
				.join(user)
				.on(sale.email.eq(user.email))
				.orderBy(sale.viewcnt.desc())  // 조회수를 기준으로 내림차순 정렬
				.where(sale.checkdelete.eq("0").and(sale.status.eq("판매중")).and(user.typename.eq(u.getTypename())))
	            .limit(6)  // 최대 6개의 결과만 반환
	            .fetch();
	}
	
	public List<Sale> salelistbyuser(PageRequest pageRequest, String typename) throws Exception{
		QSale sale= QSale.sale;
		QUser user = QUser.user;
		return jpaQueryFactory.selectFrom(sale)
				.join(user)
				.on(sale.email.eq(user.email))
				.where(sale.checkdelete.eq("0").and(user.typename.eq(typename)))
				.orderBy(sale.writedate.desc()) 
				.offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize())
				.fetch();
	}
	
	public List<Sale> categorylistbyuser(PageRequest pageRequest, String typename, String category) throws Exception {
		QSale sale= QSale.sale;
		QUser user = QUser.user;
		return jpaQueryFactory.selectFrom(sale)
				.join(user)
				.on(sale.email.eq(user.email))
				.where(sale.checkdelete.eq("0").and(user.typename.eq(typename)).and(sale.category.eq(category)))
				.orderBy(sale.writedate.desc()) 
				.offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize())
				.fetch();
	}
	
	public List<Sale> searchlistbyuser(PageRequest pageRequest, String typename, String keyword) throws Exception {
		QSale sale= QSale.sale;
		QUser user = QUser.user;
		return jpaQueryFactory.selectFrom(sale)
				.join(user)
				.on(sale.email.eq(user.email))
				.where(sale.checkdelete.eq("0").and(user.typename.eq(typename)).and(sale.title.like("%" + keyword + "%")))
				.orderBy(sale.writedate.desc()) 
				.offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize())
				.fetch();
	}
}