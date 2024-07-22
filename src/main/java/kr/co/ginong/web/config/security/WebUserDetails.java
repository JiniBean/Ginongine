package kr.co.ginong.web.config.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class WebUserDetails implements UserDetails, OAuth2User {


    private Integer mbrNo;	    /** 회원_번호 */
    private String  nm;	        /** 이름 */
    private String  userNm;	    /** ID */
    private String  pwd;	    /** 비밀번호 */
    private String  email;	    /** 이메일 */
    private String  phone;	    /** 연락처 */
    private Boolean mbrStatus;	/** 회원_상태 */
    private List<GrantedAuthority> authorities;
    private Map<String, Object> attributes;

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }
    public Integer getMbrNo() {
        return mbrNo;
    }

    public void setMbrNo(Integer mbrNo) {
        this.mbrNo = mbrNo;
    }

    public String getNm() {
        return nm;
    }

    public void setNm(String nm) {
        this.nm = nm;
    }

    public String getUserNm() {
        return userNm;
    }

    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getMbrStatus() {
        return mbrStatus;
    }

    public void setMbrStatus(Boolean mbrStatus) {
        this.mbrStatus = mbrStatus;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {return authorities;}


    public void setAuthorities(List<GrantedAuthority> authorities) {this.authorities = authorities;}


    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
}
