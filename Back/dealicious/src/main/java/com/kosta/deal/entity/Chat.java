package com.kosta.deal.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
public class Chat {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Integer num;
	 @Column
	 private String channelId;
	 private String writerId;
	 private String chat;
	 private String data;
	 private String isRead;
	 @CreationTimestamp
	 private Timestamp chatdate;
}
