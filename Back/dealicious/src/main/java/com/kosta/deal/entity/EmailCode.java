package com.kosta.deal.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailCode {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer num;
	@Column
	private String email;
	@Column
	private String code;
}
