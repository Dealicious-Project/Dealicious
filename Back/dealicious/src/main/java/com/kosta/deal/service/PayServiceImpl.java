package com.kosta.deal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kosta.deal.entity.AdminAccount;
import com.kosta.deal.entity.Chat;
import com.kosta.deal.entity.ChatRoom;
import com.kosta.deal.entity.Notification;
import com.kosta.deal.entity.Pay;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.repository.AdminAccountRepository;
import com.kosta.deal.repository.ChatRepository;
import com.kosta.deal.repository.DslRepository;
import com.kosta.deal.repository.NotiRepository;
import com.kosta.deal.repository.PayRepository;

@Service
public class PayServiceImpl implements PayService {
	
	@Autowired
	private DslRepository dslRepository;
	@Autowired
	private PayRepository payRepository;
	@Autowired
	private AdminAccountRepository adminAccountRepository;
	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	private UserListService userListService;
	@Autowired
	private SaleService saleService;
	@Autowired
	private NotiRepository notiRepository;
	
	@Override
	public void insertPay(Pay pay) throws Exception {
		payRepository.save(pay);
		AdminAccount adminAccount = adminAccountRepository.findById("12345-12345").get();
		adminAccount.setBalance(adminAccount.getBalance()+pay.getPayAmount());
		adminAccountRepository.save(adminAccount);
		ChatRoom chatRoom = dslRepository.findChatRoomBySalenumAndCreator(pay.getSalenum(),pay.getBuyerEmail());
		
    	Sale sale = saleService.saleDetail(pay.getSalenum());
    	Notification noti1 = new Notification();
    	noti1.setChannelId(chatRoom.getChannelId());
    	noti1.setTitle("작성하신 '"+sale.getTitle()+"' 거래가 결제 완료되었습니다.");
    	noti1.setContent("구매자에게 물건을 전달해주세요:)");
    	noti1.setEmail(sale.getEmail());
    	noti1.setType("activity");
    	notiRepository.save(noti1);
    	Notification noti2 = new Notification();
    	noti2.setChannelId(chatRoom.getChannelId());
    	noti2.setTitle("'"+sale.getTitle()+"' 의 결제가 완료되었습니다.");
    	noti2.setContent("물건을 받으셨나요? 수령완료 버튼을 눌러주세요:)");
    	noti2.setEmail(pay.getBuyerEmail());
    	noti2.setType("activity");
    	notiRepository.save(noti2);
    	
    	Chat chat = new Chat();
    	chat.setType("completepay");
    	chat.setChannelId(chatRoom.getChannelId());
    	chat.setWriterId("admin");
    	chat.setChat("결제 완료 메세지");
    	chatRepository.save(chat);
    	userListService.sendPayNoti(chat,pay.getBuyerEmail(),sale.getEmail());
	}
}
