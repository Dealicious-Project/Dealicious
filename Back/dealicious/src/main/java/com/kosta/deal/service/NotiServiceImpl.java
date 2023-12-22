package com.kosta.deal.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kosta.deal.entity.Hot;
import com.kosta.deal.entity.Keyword;
import com.kosta.deal.entity.Notification;
import com.kosta.deal.repository.DslRepository;
import com.kosta.deal.repository.HotRepository;
import com.kosta.deal.repository.KeywordRepository;
import com.kosta.deal.repository.NotiRepository;

@Service
public class NotiServiceImpl implements NotiService {
	
	@Autowired
	private DslRepository dslRepository;
	
	@Autowired
	private HotRepository hotRepository;
	@Autowired
	private NotiRepository notiRepository;
	@Autowired
	private KeywordRepository keywordRepository;
	
	@Override
	public List<Hot> getHotList() throws Exception {
		
		return dslRepository.findHotList();
	}

	@Override
	public void addKeyword(String keyword) throws Exception {
		Optional<Hot> ohot = hotRepository.findByContent(keyword);
		if(!ohot.isEmpty()) {
			Hot hot = ohot.get();
			hot.setSearchcnt(hot.getSearchcnt()+1);
			hotRepository.save(hot);
		} else {
			hotRepository.save(new Hot(keyword));
		}
		
	}

	@Override
	public Integer findNotiCnt(String email) throws Exception {
		List<Notification> notilist = dslRepository.findNoneReadNotiList(email);
		Integer cnt = notilist.size();
		return cnt;
	}

	@Override
	public List<Notification> findNotiActiList(String email) throws Exception {
		List<Notification> notilist = dslRepository.findNotiActiList(email);
		for(Notification n : notilist) {
			n.setIsRead("1");
			notiRepository.save(n);
		}
		return notilist;
	}

	@Override
	public List<Notification> findNotiKeywordList(String email) throws Exception {
		List<Notification> notilist = dslRepository.findNotiKeywordList(email);
		for(Notification n : notilist) {
			n.setIsRead("1");
			notiRepository.save(n);
		}
		return notilist;
	}

	@Override
	public List<Keyword> findKeywordList(String email) throws Exception {
		List<Keyword> kewordlist = dslRepository.findKeywordList(email);
		return kewordlist;
	}

	@Override
	public void registerkeyword(Keyword keyword) throws Exception {
		keywordRepository.save(keyword);
	}

	@Override
	public void deletekeyword(Keyword keyword) throws Exception {
		keywordRepository.delete(keyword);
	}

	@Override
	public Integer findNotiActiCnt(String email) throws Exception {
		List<Notification> notilist = dslRepository.findNoneReadNotiActiList(email);
		Integer cnt = notilist.size();
		return cnt;
	}

	@Override
	public Integer findNotiKeyCnt(String email) throws Exception {
		List<Notification> notilist = dslRepository.findNoneReadNotiKeyList(email);
		Integer cnt = notilist.size();
		return cnt;
	}

}
