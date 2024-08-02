package kr.co.ginong.web.controller.rest;

import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import kr.co.ginong.web.service.member.MailService;
import org.eclipse.angus.mail.smtp.SMTPAddressFailedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("rest/mail")
public class MailController {

    @Autowired
    private MailService service;

    @PostMapping("send")
    public ResponseEntity<Map<String, Object>> send(@RequestBody Map<String, Object> info) {

        Map<String, Object> rep = new HashMap<>();
        rep.put("code", 0);
        rep.put("msg", "");
        try {
            service.send(info);
            rep.put("code", 200);
            rep.put("msg", "이메일을 성공적으로 보냈습니다");
            return ResponseEntity.ok(rep);
        } catch (IllegalStateException e) {
            rep.put("code", 300);
            rep.put("msg", "이미 가입된 정보입니다");
            return ResponseEntity.ok(rep);
        } catch (MailParseException e) {
            rep.put("code", 400);
            rep.put("msg", "잘못된 이메일입니다");
            return ResponseEntity.ok(rep);
        } catch (MailSendException e) {
            Throwable cause = e.getCause();
            if (cause instanceof SMTPAddressFailedException) {
                rep.put("code", 400);
                rep.put("msg", "잘못된 이메일입니다");
                return ResponseEntity.ok(rep);
            }
            rep.put("code", 500);
            rep.put("msg", "이메일 전송에 실패했습니다");
            return ResponseEntity.ok(rep);
        } catch (RuntimeException | MessagingException e) {
            rep.put("code", 500);
            rep.put("msg", "이메일 전송에 실패했습니다");
            return ResponseEntity.ok(rep);
        }
    }

    @GetMapping("confirm")
    public ResponseEntity<Map<String,Object>> confirm(@RequestParam("c") int code) {

        Map<String, Object> rep = new HashMap<>();
        rep.put("code", -1);
        rep.put("msg", "인증에 실패하였습니다");

        boolean isConfirmed = service.confirm(code);
        if (isConfirmed) {
            rep.put("code", 200);
            rep.put("msg", "인증에 성공하였습니다");
        }
        return ResponseEntity.ok(rep);

    }
}