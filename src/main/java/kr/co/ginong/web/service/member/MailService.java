package kr.co.ginong.web.service.member;

import jakarta.mail.MessagingException;

import java.util.Map;

public interface MailService {

    void send(Map<String,Object> info) throws IllegalStateException, MessagingException;

    boolean confirm(int code);
}
