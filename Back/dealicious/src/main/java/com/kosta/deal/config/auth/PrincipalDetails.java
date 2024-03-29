package com.kosta.deal.config.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.kosta.deal.entity.Admin;
import com.kosta.deal.entity.User;

import lombok.Data;

//security가 /loginProc 주소를 낚아채서 로그인을 진행시킨다.
//로그인 진행이 완료가 되면 security session을 만들어준다. (Security ContextHolder)
//security session에 들어가는 타입은 Authentication 타입의 객체여야 한다.
//Authentication안에 User 정보를 넣어야 한다.
//그 User 오브젝트 타입은 UserDetails 타입이어야 한다.
@Data
public class PrincipalDetails implements UserDetails, OAuth2User {
	private User user;
	private Admin admin;
	private Map<String, Object> attributes;
	
	public PrincipalDetails(User user) {
		this.user=user;
	}
	
	public PrincipalDetails(Admin admin) {
		this.admin=admin;
	}

	public PrincipalDetails(User user, Map<String, Object> attributes) {
		this.user=user;
		this.attributes=attributes;
	}
	
	public PrincipalDetails(Admin admin, Map<String, Object> attributes) {
		this.admin=admin;
		this.attributes=attributes;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collect = new ArrayList<>();
		collect.add(new GrantedAuthority() {
			@Override
			public String getAuthority() {
				if(user==null) {
					return admin.getRoles();
				} else {
					return user.getRoles();
				}
			}
		});
		return collect;
	}

	@Override
	public String getPassword() {
		if(user==null) {
			return admin.getPassword();
		} else {
			return user.getPassword();
		}
	}

	@Override
	public String getUsername() {
		if(user==null) {
			return admin.getAdminid();
		} else {
			return user.getUsername();
		}
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}

	@Override
	public String getName() {
		return user.getId()+"";
	}
}
