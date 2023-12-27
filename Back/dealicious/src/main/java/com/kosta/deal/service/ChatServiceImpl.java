package com.kosta.deal.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kosta.deal.entity.Chat;
import com.kosta.deal.entity.ChatRoom;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.entity.User;
import com.kosta.deal.repository.ChatRepository;
import com.kosta.deal.repository.ChatRoomRepository;
import com.kosta.deal.repository.DslRepository;

@Service
public class ChatServiceImpl implements ChatService {

	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	private ChatRoomRepository chatRoomRepository;

	@Autowired
	private DslRepository dslRepository;

	@Override
	public void addChat(Chat chat) throws Exception {
		chatRepository.save(chat);
	}

	@Override
	public void addChatRoom(ChatRoom chatRoom) throws Exception {
		chatRoomRepository.save(chatRoom);
	}

	@Override
	public ChatRoom findChatRoomByChannelid(String channelId) throws Exception {
		return chatRoomRepository.findByChannelId(channelId).get();
	}

	@Override
	public ChatRoom findChatRoomBySaleNumAndEmail(Integer num, String email) throws Exception {
		return dslRepository.findChatRoomBySaleNumAndEmail(num, email);
	}

	@Override
	public List<Chat> findChatListByChannelId(User user, String channelId) throws Exception {
//		List<Chat> chatlist = dslRepository.getNonReadChat(user,channelId);
//		for(Chat c : chatlist) {
//			c.setIsRead(c.getIsRead()+","+user.getEmail());
//			chatRepository.save(c);
//		}
		return dslRepository.findChatListByChannelId(channelId);
	}

	@Override
	public List<Map<String, Object>> getChatListForm(User user) throws Exception {
		List<Map<String, Object>> res = new ArrayList<Map<String, Object>>();
		List<String> channelId = dslRepository.getChannelIdList(user.getEmail());
		for (String s : channelId) {
			ChatRoom chatRoom = chatRoomRepository.findByChannelId(s).get();
			if (chatRoom.getCreator().equals(user.getEmail())) {
				User user1 = dslRepository.getUserFromBuyer(s);
				Sale sale = dslRepository.getSaleForChatlist(s);
				Chat chat = dslRepository.getChatForChatlist(s);
				Map<String, Object> map = new HashMap<>();
				map.put("profileimgurl", user1.getProfileimgurl());
				map.put("nickname", user1.getNickname());
				map.put("category", sale.getCategory());
				if(chat!=null) { //채팅방은 만들어졌는데 채팅안쳤을때 chat불러오는거 에러발생함
					map.put("chatdate", chat.getChatdate());
					Long nonReadCnt = dslRepository.getNonReadCnt(s,user.getEmail());
					map.put("nonReadCnt", nonReadCnt);
					map.put("chat", chat.getChat());
					map.put("fileurl", sale.getFileurl());
					map.put("channelId", s);
					res.add(map);
				}
				
			} else {	
				User user1 = dslRepository.getUserFromSeller(s);
				Sale sale = dslRepository.getSaleForChatlist(s);
				Chat chat = dslRepository.getChatForChatlist(s);
				Map<String, Object> map = new HashMap<>();
				map.put("profileimgurl", user1.getProfileimgurl());
				map.put("nickname", user1.getNickname());
				map.put("category", sale.getCategory());
				if(chat!=null) { //채팅방은 만들어졌는데 채팅안쳤을때 chat불러오는거 에러발생함
					map.put("chatdate", chat.getChatdate());
					Long nonReadCnt = dslRepository.getNonReadCnt(s,chatRoom.getPartner());
					map.put("nonReadCnt", nonReadCnt);
					map.put("chat", chat.getChat());
					map.put("fileurl", sale.getFileurl());
					map.put("channelId", s);
					res.add(map);
				}
				
			}
//			if (chatRoom.getCreator().equals(user.getEmail())) {
//				Sale sale = dslRepository.getSaleForChatlist(s);
//				
//				String profileimgurl = t.get(0, String.class);
//				String nickname = t.get(1, String.class);
//				String category = t.get(2, String.class);
//				Timestamp chatdate = t.get(3, Timestamp.class);
//				String chat = t.get(4, String.class);
//				String fileurl = t.get(5, String.class);
//
//				Map<String, Object> map = new HashMap<>();
//				map.put("profileimgurl", profileimgurl);
//				map.put("nickname", nickname);
//				map.put("category", category);
//				map.put("chatdate", chatdate);
//				map.put("chat", chat);
//				map.put("fileurl", fileurl);
//				res.add(map);
//			} else {
//				Tuple t = dslRepository.getChatListFormFromWriter(s);
//				
//				String profileimgurl = t.get(0, String.class);
//				String nickname = t.get(1, String.class);
//				String category = t.get(2, String.class);
//				Timestamp chatdate = t.get(3, Timestamp.class);
//				String chat = t.get(4, String.class);
//				String fileurl = t.get(5, String.class);
//
//				Map<String, Object> map = new HashMap<>();
//				map.put("profileimgurl", profileimgurl);
//				map.put("nickname", nickname);
//				map.put("category", category);
//				map.put("chatdate", chatdate);
//				map.put("chat", chat);
//				map.put("fileurl", fileurl);
//				res.add(map);
//			}
		}
		Collections.sort(res, Comparator.comparing(m -> (Date) m.get("chatdate"), Comparator.nullsLast(Comparator.reverseOrder())));
		return res;

	}

	@Override
	public Map<String, Object> getChatRoom(User user, String channelId) throws Exception {
		User user1 = dslRepository.getUserFromSeller(channelId);
		Sale sale = dslRepository.getSaleForChatlist(channelId);
		Chat chat = dslRepository.getChatForChatlist(channelId);
		Map<String, Object> map = new HashMap<>();
		map.put("profileimgurl", user1.getProfileimgurl());
		map.put("nickname", user1.getNickname());
		map.put("category", sale.getCategory());
		map.put("chatdate", chat.getChatdate());
		map.put("nonReadCnt", 1);
		map.put("chat", chat.getChat());
		map.put("fileurl", sale.getFileurl());
		map.put("channelId", channelId);
		return map;
	}

	@Override
	public void insertisread(User user, Chat chat) throws Exception {
		Chat tchat = chatRepository.findById(chat.getNum()).get();
		if(!tchat.getIsRead().contains(user.getEmail())) {
			tchat.setIsRead(tchat.getIsRead()+","+user.getEmail());
			chatRepository.save(tchat);
		}
	}

	@Override
	public Long getChatCnt(User user) throws Exception {
		Long dd = 0L;
		List<String> channelId = dslRepository.getChannelIdList(user.getEmail());
		for (String s : channelId) {
			ChatRoom chatRoom = chatRoomRepository.findByChannelId(s).get();
			if (chatRoom.getCreator().equals(user.getEmail())) {
				Chat chat = dslRepository.getChatForChatlist(s);
				if(chat !=null) {
					Long res = dslRepository.getNonReadCnt(s,user.getEmail());
					dd += res;
				}
			} else {	
				Chat chat = dslRepository.getChatForChatlist(s);
				if(chat!=null) { //채팅방은 만들어졌는데 채팅안쳤을때 chat불러오는거 에러발생함
					Long res = dslRepository.getNonReadCnt(s,chatRoom.getPartner());
					dd += res;
				}
			}
		}

		return dd;
	}

	@Override
	public void chatRead(User user, String channelId) throws Exception {
		List<Chat> chatlist = dslRepository.getNonReadChat(user,channelId);
		for(Chat c : chatlist) {
			c.setIsRead(c.getIsRead()+","+user.getEmail());
			chatRepository.save(c);
		}
	}
}
