package kr.co.ginong.web.controller.rest;

import kr.co.ginong.web.entity.member.Mbr;
import kr.co.ginong.web.service.member.SignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController("restSignController")
@RequestMapping("rest/sign")
public class SignController {

    @Autowired
    private SignService service;

    @GetMapping("/{username}")
    public ResponseEntity<Mbr> getMember(@PathVariable String username) {
        Mbr mbr = service.getMember(username);

        return ResponseEntity.ok(mbr);
    }


    @GetMapping("/c/{username}")
    public ResponseEntity<Boolean> checkMember (@PathVariable() String username) {

        Boolean check = service.checkMember(Mbr.builder().userNm(username).build());
        return ResponseEntity.ok(check);
    };
}
