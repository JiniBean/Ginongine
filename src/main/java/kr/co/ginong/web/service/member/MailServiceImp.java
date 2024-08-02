package kr.co.ginong.web.service.member;

import jakarta.annotation.Resource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import kr.co.ginong.web.entity.member.Mbr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MailServiceImp implements MailService{

    @Resource
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender; // 발신 이메일 주소

    private int code; //인증 코드

    @Autowired
    private SignService signService;

    public MimeMessage createMimeMessage(String email) throws MessagingException {
        code = (int) ((Math.random() * (90000)) + 100000); // 100000에서 999999 사이의 랜덤한 숫자 생성
        String form = String.format(
                "<h3>%s</h3>"
                        + "<h4>%s</h4>"
                        + "<h1>%s : %s</h1>"
                        + "<h3>%s</h3>",
                "기농이네 회원가입을 위한 본인 확인 인증번호입니다.",
                "아래 인증 번호를 확인하시고 인증을 완료해주세요.",
                "인증번호", code,
                "감사합니다."
        );

        MimeMessage message = javaMailSender.createMimeMessage();       //객체 생성
        message.setFrom(sender);                                        //발신자
        message.setRecipients(MimeMessage.RecipientType.TO, email);     //수신자
        message.setSubject("[기농이네] 회원가입 인증번호를 안내해 드립니다.");  //제목
        message.setContent(form, "text/html; charset=utf-8");      //본문
        return message;
    }

    @Override
    public void send(Map<String, Object> info) throws IllegalStateException, MessagingException {
        String email = (String) info.get("email");
        boolean isNew = (boolean) info.get("isNew");
        boolean valid = true;
        if(isNew){
            valid = !signService.checkMember(Mbr.builder().email(email).build());
            if(!valid)
                throw new IllegalStateException();
        }

        MimeMessage message = createMimeMessage(email);
        javaMailSender.send(message);

    }

    @Override
    public boolean confirm(int code) {

        System.out.println(code);
        System.out.println(this.code);

        return code == this.code;
    }

}
