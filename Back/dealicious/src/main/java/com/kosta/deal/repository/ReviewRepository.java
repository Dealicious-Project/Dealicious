package com.kosta.deal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosta.deal.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer>{
	List<Review> findAllByReceiver(String email);
}
