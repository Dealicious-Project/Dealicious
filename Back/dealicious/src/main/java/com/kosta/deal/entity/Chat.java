package com.kosta.deal.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.ColumnDefault;
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
	 private String receiverId;
	 private String chat;
	 private String data;
	 
	 @ColumnDefault("0")
	 private String isRead;
	 private String type;
	 @CreationTimestamp
	 private Date chatdate;
}
