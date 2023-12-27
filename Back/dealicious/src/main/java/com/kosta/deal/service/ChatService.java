package com.kosta.deal.service;

import java.util.List;
import java.util.Map;

import com.kosta.deal.entity.Chat;
import com.kosta.deal.entity.ChatRoom;
import com.kosta.deal.entity.User;

public interface ChatService {
	void addChat(Chat chat) throws Exception;
	void addChatRoom(ChatRoom chatRoom) throws Exception;
	ChatRoom findChatRoomByChannelid(String channelId) throws Exception;
	ChatRoom findChatRoomBySaleNumAndEmail(Integer num, String Eamil) throws Exception;
	List<Chat> findChatListByChannelId(User user,String channelId) throws Exception;
	List<Map<String,Object>> getChatListForm(User user) throws Exception;
	Map<String, Object> getChatRoom(User user, String channelId) throws Exception;
	void insertisread(User user, Chat chat) throws Exception;
	Long getChatCnt(User user) throws Exception;
	void chatRead(User user, String channelId) throws Exception;
}
