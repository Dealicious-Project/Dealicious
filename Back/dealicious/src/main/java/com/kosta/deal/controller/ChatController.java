package com.kosta.deal.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.kosta.deal.config.auth.PrincipalDetails;
import com.kosta.deal.entity.Chat;
import com.kosta.deal.entity.ChatRoom;
import com.kosta.deal.entity.Sale;
import com.kosta.deal.entity.User;
import com.kosta.deal.service.ChatService;
import com.kosta.deal.service.SaleService;
import com.kosta.deal.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {
	 private static final Logger LOGGER = LoggerFactory.getLogger( ChatController.class );

    private final SimpMessageSendingOperations sendingOperations;
    private final ChatService chatService;
    private final SaleService saleService;
    private final UserService userService;
    // 새로운 사용자가 웹 소켓을 연결할 때 실행됨
    // @EventListener은 한개의 매개변수만 가질 수 있다.
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccesor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccesor.getSessionId();
        LOGGER.info("Received a new web socket connection : "+sessionId);
    }

    // 사용자가 웹 소켓 연결을 끊으면 실행됨
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccesor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccesor.getSessionId();
        LOGGER.info("sessionId Disconnected : " + sessionId);
    }
    
    @MessageMapping("/chat")
    public void sendMessage(Chat chat, SimpMessageHeaderAccessor accessor) {
    	try {
			chatService.addChat(chat);
			sendingOperations.convertAndSend("/sub/chat/" + chat.getReceiverId(), chat);
			sendingOperations.convertAndSend("/sub/chat/" + chat.getWriterId(), chat);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	
    }
    
    public void sendNotifications(User user) {
    	sendingOperations.convertAndSend("/sub/notifications/" + user.getEmail(), "알림 추가");
    }
    
    //1대1 대화 채팅방 생성된 채팅방 내역 불러오는거
    @GetMapping("/chatroom/{channelid}")
	public ResponseEntity<Map<String,Object>> chatRoom(Authentication authentication,@PathVariable String channelid) {    	
    	PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
    	User user = principalDetails.getUser();
    	try {
			ChatRoom chatRoom = chatService.findChatRoomByChannelid(channelid);
			User chatpartner = new User();
			if(chatRoom.getCreator().equals(user.getEmail())) {
				chatpartner = userService.findUserByEmail(chatRoom.getPartner());
			} else {
				chatpartner = userService.findUserByEmail(chatRoom.getCreator());
			}
			Sale sale = saleService.saleDetail(chatRoom.getSaleNum());
			List<Chat> chatlist = chatService.findChatListByChannelId(channelid);
			Map<String,Object> res = new HashMap<>();
			res.put("chatlist", chatlist);
			res.put("sale", sale);
			res.put("chatpartner", chatpartner);
			return new ResponseEntity<Map<String,Object>>(res, HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Map<String,Object>>(HttpStatus.BAD_REQUEST);
		}
	}
    //saledetail에서 채팅하기 눌렀을때 기존 채팅방이있으면 그 채팅방으로 연결하고 없으면 채팅방 하나 생성해서 전달
    @PostMapping("/findchatroom")
	public ResponseEntity<String> findchatroom(Authentication authentication,@RequestBody ChatRoom chatRoom) {
    	PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
    	User user = principalDetails.getUser();
    	try {
			ChatRoom chatRoom2 = chatService.findChatRoomBySaleNumAndEmail(chatRoom.getSaleNum(),user.getEmail());
			if(chatRoom2==null) {
	    		ChatRoom chatRoom1 = ChatRoom.builder().channelId(chatRoom.getChannelId()).creator(chatRoom.getCreator()).partner(chatRoom.getPartner()).saleNum(chatRoom.getSaleNum()).build();
	    		chatService.addChatRoom(chatRoom1);
	    		return new ResponseEntity<String>(chatRoom1.getChannelId(), HttpStatus.OK);
			} else {	
				return new ResponseEntity<String>(chatRoom2.getChannelId(), HttpStatus.OK);
			}
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
    //기존 채팅방 내역 리스트 출력
    @GetMapping("/chatroomlist")
	public ResponseEntity<List<Map<String,Object>>> chatroomlist(Authentication authentication) {    	
    	PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
    	User user = principalDetails.getUser();
    	try {
    		List<Map<String,Object>> res = chatService.getChatListForm(user);
			return new ResponseEntity<List<Map<String,Object>>>(res, HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Map<String,Object>>>(HttpStatus.BAD_REQUEST);
		}
	}
    
    @GetMapping("/receipt/{salenum}")
    public ResponseEntity<String> receipt(Authentication authentication,@PathVariable Integer salenum) {    	
    	PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
    	User user = principalDetails.getUser();
    	try {
    		saleService.changesalestatusToreceipt(salenum,user.getEmail());
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
    
    @GetMapping("/review/{fixedRating}/{partneremail}/{salenum}")
    public ResponseEntity<String> review(Authentication authentication,@PathVariable String fixedRating,@PathVariable String partneremail,@PathVariable Integer salenum) {    	
    	PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
    	User user = principalDetails.getUser();
    	try {
    		userService.registerReview(user.getEmail(),partneremail,fixedRating,salenum);
			return new ResponseEntity<String>(HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<String>(e.getMessage(),HttpStatus.BAD_REQUEST);
		}
	}
}