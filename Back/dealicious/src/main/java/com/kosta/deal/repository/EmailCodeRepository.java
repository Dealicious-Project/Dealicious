package com.kosta.deal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosta.deal.entity.EmailCode;
import com.kosta.deal.entity.User;

public interface EmailCodeRepository extends JpaRepository<EmailCode, Integer> {
	Optional<EmailCode> findByEmail(String email);
}
