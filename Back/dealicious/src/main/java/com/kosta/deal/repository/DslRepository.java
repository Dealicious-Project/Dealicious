package com.kosta.deal.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.kosta.deal.entity.Admin;
import com.kosta.deal.entity.Chat;
import com.kosta.deal.entity.ChatRoom;
import com.kosta.deal.entity.Hot;
import com.kosta.deal.entity.Keyword;
import com.kosta.deal.entity.Notification;
import com.kosta.deal.entity.QAdmin;
import com.kosta.deal.entity.QChat;
import com.kosta.deal.entity.QChatRoom;
import com.kosta.deal.entity.QCorpData;
import com.kosta.deal.entity.QHot;
import com.kosta.deal.entity.QKeyword;
import com.kosta.deal.entity.QNotification;
import com.kosta.deal.entity.QPay;
import com.kosta.deal.entity.QReview;
import com.kosta.deal.entity.QSale;
import com.kosta.deal.entity.QSaleLike;
import com.kosta.deal.entity.QUnivData;
import com.kosta.deal.entity.QUser;
import com.kosta.deal.entity.Review;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.entity.User;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	public List<Tuple> findAllPayList() {
		QPay pay = QPay.pay;
		QSale sale = QSale.sale;
		return jpaQueryFactory.select(pay.paynum, sale.status, sale.title, sale.amount).from(pay).join(sale)
				.on(pay.salenum.eq(sale.num)).fetch();
	}

	public List<Tuple> findStatusPayList(String status) {
		QPay pay = QPay.pay;
		QSale sale = QSale.sale;
		return jpaQueryFactory.select(pay.paynum, sale.status, sale.title, sale.amount).from(pay).join(sale)
				.on(pay.salenum.eq(sale.num)).where(sale.status.eq(status)).fetch();
	}

	// 내일 3개 조인하는거 하기
	public List<Tuple> findSettleList(Date sDate, Date eDate) {
		QPay pay = QPay.pay;
		QSale sale = QSale.sale;
		return jpaQueryFactory.select(pay.paynum, sale.status, sale.title, sale.amount).from(pay).join(sale)
				.on(pay.salenum.eq(sale.num))
				// .where(pay.paydate.loe(eDate).and(pay.paydate.goe(sDate)).and(sale.status.eq("정산완료")))
				.fetch();
	}

	public List<String> findUnivNameList(String typename) {
		QUnivData univData = QUnivData.univData;
		return jpaQueryFactory.select(univData.schoolName).from(univData)
				.where(univData.schoolName.like("%" + typename + "%"))
				.orderBy(univData.schoolName.asc()).fetch();
	}

	public Admin findAdminById(String adminid) {
		QAdmin admin = QAdmin.admin;
		return jpaQueryFactory.selectFrom(admin).where(admin.adminid.eq(adminid)).fetchOne();
	}

	public List<String> findCorpNameList(String typename) {
		QCorpData corpData = QCorpData.corpData;
		return jpaQueryFactory.select(corpData.corp_name).from(corpData)
				.where(corpData.corp_name.like("%" + typename + "%"))
				.orderBy(corpData.corp_name.asc()).fetch();
	}

	public List<Hot> findHotList() {
		QHot hot = QHot.hot;
		return jpaQueryFactory.selectFrom(hot).orderBy(hot.searchcnt.desc()).limit(10).fetch();
	}

	public ChatRoom findChatRoomByUserEmail(String email) {
		QChatRoom chatRoom = QChatRoom.chatRoom;
		return jpaQueryFactory.selectFrom(chatRoom).where(chatRoom.creator.eq(email).or(chatRoom.partner.eq(email)))
				.fetchOne();
	}

	public ChatRoom findChatRoomBySaleNumAndEmail(Integer num, String email) {
		QChatRoom chatRoom = QChatRoom.chatRoom;
		return jpaQueryFactory.selectFrom(chatRoom).where(chatRoom.saleNum.eq(num).and(chatRoom.creator.eq(email)))
				.fetchOne();

	}

	public List<Chat> findChatListByChannelId(String channelId) {
		QChat chat = QChat.chat1;
		return jpaQueryFactory.selectFrom(chat).where(chat.channelId.eq(channelId)).fetch();
	}

//	public Tuple getChatListFormFromWriter(String channelId) {
//		QChatRoom chatRoom = QChatRoom.chatRoom;
//		QChat chat = QChat.chat1;
//		QSale sale = QSale.sale;
//		QUser user = QUser.user;
//
//		return jpaQueryFactory.select(user.profileimgurl,user.nickname,sale.category,chat.chatdate,chat.chat,sale.fileurl)
//				.from(chatRoom)
//				.join(chat)
//				.on(chatRoom.channelId.eq(chat.channelId))
//				.join(sale)
//				.on(chatRoom.saleNum.eq(sale.num))
//				.join(user)
//				.on(user.email.eq(sale.email))
//				.where(chatRoom.channelId.eq(channelId))
//				.orderBy(chat.chatdate.desc())
//				.fetchFirst();
//	}
//	public Tuple getChatListFormFromBuyer(String channelId) {
//		QChatRoom chatRoom = QChatRoom.chatRoom;
//		QChat chat = QChat.chat1;
//		QSale sale = QSale.sale;
//		QUser user = QUser.user;
//
//		return jpaQueryFactory.select(user.profileimgurl,user.nickname,sale.category,chat.chatdate,chat.chat,sale.fileurl)
//				.from(chatRoom)
//				.from(chat)
//				.from(sale)
//				.from(user)
//				.where(chatRoom.channelId.eq(chat.channelId).and(chatRoom.saleNum.eq(sale.num)).and(user.email.eq(chatRoom.creator)).and(chatRoom.channelId.eq(channelId)))
//				.orderBy(chat.chatdate.desc())
//				.fetchFirst();
//	}
	public Sale getSaleForChatlist(String channelId) {
		QChatRoom chatRoom = QChatRoom.chatRoom;
		QSale sale = QSale.sale;
		return jpaQueryFactory.select(sale).from(chatRoom).join(sale).on(chatRoom.saleNum.eq(sale.num))
				.where(chatRoom.channelId.eq(channelId)).fetchOne();
	}

	public User getUserFromBuyer(String channelId) {
		QChatRoom chatRoom = QChatRoom.chatRoom;
		QUser user = QUser.user;
		return jpaQueryFactory.select(user).from(chatRoom).join(user)
				.on(chatRoom.partner.eq(user.email).and(chatRoom.channelId.eq(channelId))).fetchOne();
	}

	public User getUserFromSeller(String channelId) {
		QChatRoom chatRoom = QChatRoom.chatRoom;
		QUser user = QUser.user;
		return jpaQueryFactory.select(user).from(chatRoom).join(user)
				.on(chatRoom.creator.eq(user.email).and(chatRoom.channelId.eq(channelId))).fetchOne();
	}

	public Chat getChatForChatlist(String channelId) {
		QChat chat = QChat.chat1;
		return jpaQueryFactory.select(chat).from(chat).where(chat.channelId.eq(channelId)).orderBy(chat.chatdate.desc())
				.fetchFirst();
	}

	public List<String> getChannelIdList(String email) {
		QChatRoom chatRoom = QChatRoom.chatRoom;
		return jpaQueryFactory.select(chatRoom.channelId).from(chatRoom)
				.where(chatRoom.creator.eq(email).or(chatRoom.partner.eq(email))).fetch();
	}

	public ChatRoom findChatRoomBySalenumAndCreator(Integer saleNum, String email) {
		QChatRoom chatRoom = QChatRoom.chatRoom;
		return jpaQueryFactory.selectFrom(chatRoom).where(chatRoom.creator.eq(email).and(chatRoom.saleNum.eq(saleNum)))
				.fetchOne();
	}

	public Review getReviewForCheck(String userEmail, String partnerEmail, Integer salenum) {
		QReview review = QReview.review;
		return jpaQueryFactory.selectFrom(review)
				.where(review.giver.eq(userEmail).and(review.receiver.eq(partnerEmail)).and(review.salenum.eq(salenum)))
				.fetchOne();
	}

	public List<Notification> findNoneReadNotiList(String email) {
		QNotification notification = QNotification.notification;
		return jpaQueryFactory.selectFrom(notification)
				.where(notification.email.eq(email).and(notification.isRead.eq("0"))).fetch();
	}

	public List<Notification> findNotiActiList(String email) {
		QNotification notification = QNotification.notification;
		return jpaQueryFactory.selectFrom(notification)
				.where(notification.email.eq(email).and(notification.type.eq("activity")))
				.orderBy(notification.notidate.desc()).fetch();
	}

	public List<Tuple> findNotiKeywordList(String email) {
		QNotification notification = QNotification.notification;
		QSale sale = QSale.sale;
		return jpaQueryFactory.select(notification, sale)
				.from(notification)
	            .join(sale)
	            .on(notification.salenum.eq(sale.num))
	            .where(notification.email.eq(email).and(notification.type.eq("keyword")))
	            .orderBy(notification.notidate.desc())
	            .fetchJoin()
	            .fetch();

	}

	public List<Sale> findZzimListByUserEmail(String email) {
		QSaleLike salelike = QSaleLike.saleLike;
		QSale sale = QSale.sale;
		return jpaQueryFactory.select(sale)
				.from(salelike)
				.join(sale)
				.on(sale.num.eq(salelike.saleNum))
				.where(salelike.userEmail.eq(email))
				.orderBy(sale.writedate.desc())
				.fetch();
	}

	public List<Tuple> findReviewByReceiver(String email) {
		QReview review = QReview.review;
		QUser user = QUser.user;
		QSale sale = QSale.sale;
		return jpaQueryFactory
				.select(user.profileimgurl, user.nickname, review.starcount, sale.ggull, sale.fileurl,
						review.reviewdate)
				.from(review).from(sale).from(user)
				.where(review.receiver.eq(email).and(sale.num.eq(review.salenum)).and(user.email.eq(review.giver)))
				.orderBy(review.reviewdate.desc())
				.fetch();
	}
	
	public List<Sale> findSaleListByUserEmail(String email) {
		QSale sale = QSale.sale;
		return jpaQueryFactory.select(sale)
				.from(sale)
				.where(sale.email.eq(email).and(sale.checkdelete.eq("0")))
				.orderBy(sale.writedate.desc())
				.fetch();
	}
	
	public List<Keyword> findKeywordList(String email) {
		QKeyword keyword = QKeyword.keyword;
		return jpaQueryFactory.selectFrom(keyword)
				.where(keyword.email.eq(email))
				.fetch();
	}
	
	public List<Keyword> getAllKeywordList() {
		QKeyword keyword = QKeyword.keyword;
		return jpaQueryFactory.selectFrom(keyword)
				.fetch();
	}
	
	public List<Notification> findNoneReadNotiActiList(String email) {
		QNotification notification = QNotification.notification;
		return jpaQueryFactory.selectFrom(notification)
				.where(notification.email.eq(email).and(notification.isRead.eq("0")).and(notification.type.eq("activity"))).fetch();
	}
	
	public List<Notification> findNoneReadNotiKeyList(String email) {
		QNotification notification = QNotification.notification;
		return jpaQueryFactory.selectFrom(notification)
				.where(notification.email.eq(email).and(notification.isRead.eq("0")).and(notification.type.eq("keyword"))).fetch();
	}
	
	public Long getNonReadCnt(String channelId, String email) {
	    QChat chat = QChat.chat1;
	    return jpaQueryFactory.selectFrom(chat)
	            .where(chat.channelId.eq(channelId)
	                    .and(chat.isRead.contains(email).not()))
	            .fetchCount();
	}
	
	public List<Chat> getNonReadChat(User user, String channelId) {
		QChat chat = QChat.chat1;
		return jpaQueryFactory.selectFrom(chat)
				.where(chat.channelId.eq(channelId)
	                    .and(chat.isRead.contains(user.getEmail()).not()))
				.fetch();
	}
	
	public List<Notification> findNonReadNotiActiList(String email) {
		QNotification notification = QNotification.notification;
		return jpaQueryFactory.selectFrom(notification)
				.where(notification.email.eq(email).and(notification.type.eq("activity")).and(notification.isRead.eq("0")))
				.fetch();
	}

	public List<Notification> findNonReadNotiKeywordList(String email) {
		QNotification notification = QNotification.notification;
		return jpaQueryFactory.selectFrom(notification)
				.where(notification.email.eq(email).and(notification.type.eq("keyword")).and(notification.isRead.eq("0")))
				.fetch();
	}
}