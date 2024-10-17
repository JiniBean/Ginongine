package kr.co.ginong.web.service.member;

import kr.co.ginong.web.entity.member.Mbr;
import kr.co.ginong.web.repository.member.MbrRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SingServiceImp implements SignService{

    @Autowired
    private MbrRepository mbrRepository;

    @Override
    public Boolean addMember(Mbr member) {
        return mbrRepository.save(member);
    }

    @Override
    public Boolean checkMember(Mbr member) {
        Mbr mbr;
        if(member.getMbrNo()!=null)
            mbr = mbrRepository.findByMbrNo(member.getMbrNo());
        else if (member.getUserNm()!=null)
            mbr = mbrRepository.findByUsername(member.getUserNm());
        else
            mbr = mbrRepository.findByEmail(member.getEmail());

        return mbr != null;
    }

    @Override
    public Mbr getMember(String username) {
        return mbrRepository.findByUsername(username);
    }
}
