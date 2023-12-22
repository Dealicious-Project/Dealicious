package com.kosta.deal.config;

import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

@Configuration
public class ChatErrorHandler extends StompSubProtocolErrorHandler {
	@Override
	public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {

		// 오류 메시지가 "UNAUTHORIZED"인 경우 - throw new
		// MessageDeliveryException("UNAUTHORIZED")
		if ("UNAUTHORIZED".equals(ex.getMessage())) {
			return errorMessage("유효하지 않은 권한입니다.");
		}

		return super.handleClientMessageProcessingError(clientMessage, ex);
	}

	/**
	 * 오류 메시지를 포함한 Message 객체를 생성
	 *
	 * @param errorMessage 오류 메시지
	 * @return 오류 메시지를 포함한 Message 객체
	 */
	private Message<byte[]> errorMessage(String errorMessage) {

		StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
		accessor.setLeaveMutable(true);

		return MessageBuilder.createMessage(errorMessage.getBytes(StandardCharsets.UTF_8),
				accessor.getMessageHeaders());
	}
}
