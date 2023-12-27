package com.kosta.deal.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
@DynamicUpdate
public class User {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column
	private String username;
	private String password;
	private String socialemail;
	private String roles;
	private String type;
	private String typename;
	private String nickname;
	private String email;
	private String tel;
	private String accountid;
	private String accountbank;
	private String name;
	private String profileimgurl;
	private BigDecimal starpoint;
	
	@CreationTimestamp
	private Timestamp createDate;
	//OAuth를 위해 구성한 추가 필드 2개
	private String provider;
	private String providerId;	
	public List<String> getRoleList() {
		if(this.roles.length()>0) {
			return Arrays.asList(this.roles.split(","));
		}
		return new ArrayList<>();
	}
}
