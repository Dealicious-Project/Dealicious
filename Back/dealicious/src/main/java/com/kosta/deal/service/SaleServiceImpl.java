package com.kosta.deal.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.deal.entity.Chat;
import com.kosta.deal.entity.ChatRoom;
import com.kosta.deal.entity.FileVo;
import com.kosta.deal.entity.Keyword;
import com.kosta.deal.entity.Notification;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.entity.SaleLike;
import com.kosta.deal.repository.ChatRepository;
import com.kosta.deal.repository.DslRepository;
import com.kosta.deal.repository.FileVoRepository;
import com.kosta.deal.repository.NotiRepository;
import com.kosta.deal.repository.SaleDslRepository;
import com.kosta.deal.repository.SaleLikeRepository;
import com.kosta.deal.repository.SaleRepository;
import com.kosta.deal.util.PageInfo;
import com.querydsl.core.Tuple;

@Service
public class SaleServiceImpl implements SaleService {

	@Autowired
	private SaleRepository saleRepository;

	@Autowired
	private SaleDslRepository saleDslRepository;
	@Autowired
	private FileVoRepository fileVoRepository;

	@Autowired
	private SaleLikeRepository salelikeRepository;
	@Autowired
	private DslRepository dslRepository;
	@Autowired
	private ChatRepository chatRepository;
	@Autowired
	private NotiRepository notiRepository;
	@Autowired
	private UserListService userListService;

	// salelist 무한 스크롤 페이지 처리
	@Override
	public List<Sale> saleListByPage(Integer page) throws Exception {
		PageRequest pageRequest = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "num"));// PageRequest																											// 페이징																								// API
		Page<Sale> pages = saleRepository.findByCheckdelete("0",pageRequest);
		List<Sale> saleList = new ArrayList<>();
		for (Sale sale : pages.getContent()) {
			saleList.add(sale);
		}
		return saleList;
	}

	@Override
	public List<Sale> categoryListByPage(String category, Integer page) throws Exception {
		PageRequest pageRequest=PageRequest.of(page-1,10,
				Sort.by(Sort.Direction.DESC,"num"));
		Page<Sale> pages = saleRepository.findByCategoryAndCheckdelete(category, "0", pageRequest);
		List<Sale> saleList = new ArrayList<>();
		for(Sale sale : pages.getContent()) {
			saleList.add(sale);
		}
		return saleList;
	}
	
	@Override
	public List<Sale> salesearchlistByPage(String keyword, Integer page) throws Exception {
		PageRequest pageRequest=PageRequest.of(page-1,10,
				Sort.by(Sort.Direction.DESC,"num"));
		Page<Sale> pages = saleRepository.findByTitleContains(keyword, pageRequest);
		List<Sale> saleList = new ArrayList<>();
		for(Sale sale : pages.getContent()) {
			saleList.add(sale);
		}
		return saleList;
	}

	

	@Override
	public Map<String, Object> saleInfo(Integer num) throws Exception {
		Tuple tuple = saleDslRepository.findUserEmailAndRolesBySaleNum(num);

		Sale sale = tuple.get(0, Sale.class);
		String nickname = tuple.get(1, String.class);

		String typename = tuple.get(2, String.class);
		String profileimgurl = tuple.get(3, String.class);
		String email = tuple.get(4, String.class);
		Integer id = tuple.get(5, Integer.class);

		Map<String, Object> res = new HashMap<>();
		res.put("sale", sale);
		res.put("nickname", nickname);
		res.put("typename", typename);
		res.put("profileimgurl", profileimgurl);
		res.put("email", email);
		res.put("id", id);
		return res;

	}

	@Override
	public Integer saleWrite(Sale sale, List<MultipartFile> files) throws Exception {
		String dir = "c:/upload/";
		if (files != null && !files.isEmpty()) {
			String fileNums = "";
			for (MultipartFile file : files) {
				// file table에 insert
				FileVo fileVo = FileVo.builder().directory(dir).name(file.getOriginalFilename()).size(file.getSize())
						.contenttype(file.getContentType()).data(file.getBytes()).build();
				fileVoRepository.save(fileVo);

				// upload 폴더에 upload
				File uploadFile = new File(dir + fileVo.getNum());
				file.transferTo(uploadFile);
				// file 번호 목록 만들기
				if (!fileNums.equals(""))
					fileNums += ",";
				fileNums += fileVo.getNum();
			}
			sale.setFileurl(fileNums);

		}
		Sale sale1 = sale;
		saleRepository.save(sale1);
		
		//sale.title에 keyword 내용이 포함될 경우 알림 생성
		List<Keyword> keywordlist = dslRepository.getAllKeywordList();
		for(Keyword k : keywordlist) {
			if(sale1.getTitle().contains(k.getContent())) {
				Notification noti1 = new Notification();
				noti1.setTitle("등록하신 '"+k.getContent()+"' 키워드 상품이 등록되었습니다.");
		    	noti1.setContent("지금 바로 확인하러 가실까요?");
		    	noti1.setEmail(k.getEmail());
		    	noti1.setType("keyword");
		    	noti1.setSalenum(sale1.getNum());
		    	notiRepository.save(noti1);
		    	Chat chat = new Chat();
		    	chat.setType("notikeyword");
		    	chat.setWriterId("admin");
		    	userListService.sendKeywordNoti(chat,k.getEmail());
			}
		}
		
		return sale1.getNum();
	}

	@Override
	public void plusViewCount(Integer num) throws Exception {
		Sale sale = saleRepository.findById(num).get();
		sale.setViewcnt(sale.getViewcnt() + 1);
		saleRepository.save(sale);

	}

	@Override
	public Boolean selHeartSale(String email, Integer num) throws Exception {
		Sale sale = saleRepository.findById(num).get();
		SaleLike salelike = saleDslRepository.findSalelike(email, num);
		if (salelike == null) {
			salelikeRepository.save(SaleLike.builder().userEmail(email).saleNum(num).build());
			sale.setZzimcnt(sale.getZzimcnt() + 1);
			saleRepository.save(sale);
			return true;
		} else {
			salelikeRepository.deleteById(salelike.getNum());
			sale.setZzimcnt(sale.getZzimcnt() - 1);
			saleRepository.save(sale);
			return false;
		}
	}

	@Override
	public void readImage(Integer num, OutputStream out) throws Exception {
		String dir = "c:/upload/";
		FileInputStream fis = new FileInputStream(dir + num);
		FileCopyUtils.copy(fis, out);
		fis.close();
	}

	@Override
	public Boolean isHeartSale(String email, Integer num) throws Exception {
		Long cnt = saleDslRepository.findIsSalelike(email, num);
		if (cnt < 1)
			return false;
		return true;
	}

	@Override
	public Sale saleDetail(String email,Integer num) {
		return saleDslRepository.findSaleBySaleNum(num);
	}

	@Override
	public Integer saleModify(Sale sale, List<MultipartFile> files) throws Exception {
		Sale sale1 = saleRepository.findByNum(sale.getNum());
		sale1.setContent(sale.getContent());
		sale1.setTitle(sale.getTitle());
		sale1.setCategory(sale.getCategory());
		sale1.setAmount(sale.getAmount());
		sale1.setPlace(sale.getPlace());
		sale1.setGgull(sale.getGgull());

		if (files != null && files.size() != 0) {
			String dir = "c:/upload/";
			String fileNums = "";
			for (MultipartFile file : files) {
				// file table에 insert
				if (file.isEmpty()) {
					fileNums += (fileNums.equals("") ? "" : ",") + file.getOriginalFilename();
				} else {
					FileVo fileVo = FileVo.builder().directory(dir).name(file.getOriginalFilename())
							.size(file.getSize()).contenttype(file.getContentType()).data(file.getBytes()).build();
					fileVoRepository.save(fileVo);

					// upload 폴더에 upload
					File uploadFile = new File(dir + fileVo.getNum());
					file.transferTo(uploadFile);
					fileNums += (fileNums.equals("") ? "" : ",") + fileVo.getNum();
				}
			}
			sale1.setFileurl(fileNums);
		} else {
			sale1.setFileurl(null);
		}
		saleRepository.save(sale1);
		return sale1.getNum();
	}
	
	@Override
	public void changesalestatus(Integer num, String status) throws Exception {
		Sale sale = saleRepository.findByNum(num);

		sale.setStatus(status);
	    saleRepository.save(sale);
	}
	
	@Override
	public void saleDelete(Integer num) throws Exception {
		Sale sale = saleRepository.findByNum(num);
		sale.setCheckdelete("1");
		saleRepository.save(sale);
	}
	
	@Override
	public void payFinish(Integer num) throws Exception {
		Sale sale = saleRepository.findByNum(num);
		sale.setStatus("결제완료");
		saleRepository.save(sale);
	}
	
	//sale status 수령완료로 변경 후 수령완료 관련 채팅 등록 및 실시간 발송
	@Override
	public void changesalestatusToreceipt(Integer num, String email) throws Exception {
		Sale sale = saleRepository.findByNum(num);
		sale.setStatus("수령완료");
		saleRepository.save(sale);
		ChatRoom chatRoom = dslRepository.findChatRoomBySalenumAndCreator(num,email);
		
    	Notification noti1 = new Notification();
    	noti1.setChannelId(chatRoom.getChannelId());
    	noti1.setTitle("작성하신 '"+sale.getTitle()+"' 거래가 완료되었습니다.");
    	noti1.setContent("후기를 작성해주세요!");
    	noti1.setEmail(sale.getEmail());
    	noti1.setType("activity");
    	notiRepository.save(noti1);
    	Notification noti2 = new Notification();
    	noti2.setChannelId(chatRoom.getChannelId());
    	noti2.setTitle("구매하신 '"+sale.getTitle()+"' 의 거래가 완료되었습니다.");
    	noti2.setContent("후기를 작성해주세요!");
    	noti2.setEmail(email);
    	noti2.setType("activity");
    	notiRepository.save(noti2);
		Chat chat = new Chat();
    	chat.setType("completereceipt");
    	chat.setChannelId(chatRoom.getChannelId());
    	chat.setWriterId("admin");
    	chat.setChat("거래 완료 메세지");
    	chatRepository.save(chat);
    	
    	userListService.sendCompleteNoti(chat,email,sale.getEmail());
	}

	@Override
	public Sale saleDetail(Integer num) throws Exception {
		return saleRepository.findByNum(num);
	}

	@Override
	public List<Sale> hotsalelist() throws Exception {
		return saleDslRepository.hotsalelist();
	}
}