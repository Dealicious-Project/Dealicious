package com.kosta.deal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosta.deal.entity.Notification;

public interface NotiRepository extends JpaRepository<Notification, Integer> {

}
