package com.kosta.api.dto;

public class AnimalClinic {
	private String trdStateNm; // �������¸�
	private String siteTel; // ��ȭ��ȣ
	private String rdnwhlAddr; // ���θ��ּ�
	private String bplcNm; // ����ڸ�
	private String x; // ��ǥ���� x
	private String y; // ��ǥ���� y
	
	public AnimalClinic(String trdStateNm, String siteTel, String rdnwhlAddr, String bplcNm, String x, String y) {
		this.trdStateNm = trdStateNm;
		this.siteTel = siteTel;
		this.rdnwhlAddr = rdnwhlAddr;
		this.bplcNm = bplcNm;
		this.x = x;
		this.y = y;
	}
	
	public String getTrdStateNm() {
		return trdStateNm;
	}
	public void setTrdStateNm(String trdStateNm) {
		this.trdStateNm = trdStateNm;
	}
	public String getSiteTel() {
		return siteTel;
	}
	public void setSiteTel(String siteTel) {
		this.siteTel = siteTel;
	}
	public String getRdnwhlAddr() {
		return rdnwhlAddr;
	}
	public void setRdnwhlAddr(String rdnwhlAddr) {
		this.rdnwhlAddr = rdnwhlAddr;
	}
	public String getBplcNm() {
		return bplcNm;
	}
	public void setBplcNm(String bplcNm) {
		this.bplcNm = bplcNm;
	}
	public String getX() {
		return x;
	}
	public void setX(String x) {
		this.x = x;
	}
	public String getY() {
		return y;
	}
	public void setY(String y) {
		this.y = y;
	}
}