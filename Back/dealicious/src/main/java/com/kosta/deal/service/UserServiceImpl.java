package com.kosta.deal.service;


import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kosta.deal.entity.EmailCode;
import com.kosta.deal.entity.FileVo;
import com.kosta.deal.entity.Review;
import com.kosta.deal.entity.User;
import com.kosta.deal.repository.DslRepository;
import com.kosta.deal.repository.EmailCodeRepository;
import com.kosta.deal.repository.FileVoRepository;
import com.kosta.deal.repository.ReviewRepository;
import com.kosta.deal.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	@Value("${spring.mail.auth-code-expiration-millis:5000}") // 기본값 5000 설정
    private long authCodeExpirationMillis;
	private static final String AUTH_CODE_PREFIX = "AuthCode ";
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private FileVoRepository fileVoRepository;
	@Autowired
	private MailService mailService;
	@Autowired
	private RedisService redisService;
	@Autowired
	private ReviewRepository reviewRepository;
	@Autowired
	private DslRepository dslRepository;
	@Autowired
	private EmailCodeRepository emailCodeRepository;

	@Override
	public User login(String email, String password) throws Exception {
		Optional<User> ouser = userRepository.findByEmail(email);
		if (ouser.isEmpty())
			throw new Exception("아이디 오류");
		User user = ouser.get();
		if (!user.getPassword().equals(password))
			throw new Exception("비밀번호 오류");
		return user;
	}

	@Override
	public boolean checkNickname(String nickname) throws Exception {
		boolean checknickname = userRepository.existsByNickname(nickname);
		if (checknickname) {
			return false;
		}
		return true;
	}

	@Override
	public void uploadProfileimg(User user, MultipartFile file) throws Exception {
		String dir="c:/upload/";
		if (file != null && !file.isEmpty()) {
            try {
                FileVo fileVo = FileVo.builder().directory(dir).name(file.getOriginalFilename())
                        .size(file.getSize()).contenttype(file.getContentType()).data(file.getBytes()).build();
                fileVoRepository.save(fileVo);
                
                File uploadFile = new File(dir + fileVo.getNum());
                file.transferTo(uploadFile);

                String fileNums = Integer.toString(fileVo.getNum());
                user.setProfileimgurl(fileNums);
            } catch (IOException e) {
                // 파일 저장 중 예외 발생 시 클라이언트에게 알림
                throw new Exception("프로필 이미지를 업로드하는 중 오류가 발생했습니다.");
            }
        }
	}

	@Override
	public User findUserByEmail(String email) throws Exception {
		
		return userRepository.findByEmail(email).get();
	}

	@Override
	public void sendCodeToEmail(String toEmail) throws Exception {
		Optional<User> user = userRepository.findByEmail(toEmail);
        if (user.isPresent()) {
            throw new Exception();
        }
        String title = "Dealicious 이메일 인증 번호";
        String authCode = this.createCode();
        mailService.sendEmail(toEmail, title, authCode);
        // 이메일 인증 요청 시 인증 번호 Redis에 저장 ( key = "AuthCode " + Email / value = AuthCode )
//        redisService.setValues(AUTH_CODE_PREFIX + toEmail,
//                authCode, Duration.ofMillis(this.authCodeExpirationMillis));
        Optional<EmailCode> emailCode = emailCodeRepository.findByEmail(toEmail);
        if (emailCode.isPresent()) { 
        	EmailCode emailCode1 = emailCode.get();
        	emailCode1.setCode(authCode);
        	emailCodeRepository.save(emailCode1);
        } else {
        	EmailCode emailCode1 = new EmailCode();
            emailCode1.setEmail(toEmail);
            emailCode1.setCode(authCode);
            emailCodeRepository.save(emailCode1);
        }
        
	}

	@Override
	public void verifiedCode(String email, String authCode) throws Exception {
		EmailCode emailCode = emailCodeRepository.findByEmail(email).get();
        if (!emailCode.getCode().equals(authCode)) { 
        	throw new Exception("이메일 인증코드 오류");
        }
	}

	@Override
	public String createCode() throws Exception {
		int lenth = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < lenth; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new Exception("MemberService.createCode() exception occur 오류");
        }
	}

	@Override
	public void registerReview(String userEmail, String partnerEmail, String startCnt,Integer salenum) throws Exception {
		Review review = new Review();
		review.setGiver(userEmail);
		review.setReceiver(partnerEmail);
		review.setStarcount(startCnt);
		review.setSalenum(salenum);
		Review review2 = dslRepository.getReviewForCheck(userEmail,partnerEmail,salenum);
		if(review2!=null) throw new Exception("이미 리뷰를 작성하셨습니다.");
		reviewRepository.save(review);
		List<Review> reviewList = reviewRepository.findAllByReceiver(review.getReceiver());
		
		Integer total = 0;
		for(Review r : reviewList) {
			total += Integer.parseInt(r.getStarcount());
		}
		BigDecimal totalscore = BigDecimal.valueOf(total);
		BigDecimal totalcnt = BigDecimal.valueOf(reviewList.size());
        RoundingMode roundingMode = RoundingMode.HALF_UP;
		BigDecimal starpoint = totalscore.divide(totalcnt,2,roundingMode);
		User user = userRepository.findByEmail(partnerEmail).get();
		user.setStarpoint(starpoint);
		userRepository.save(user);
	}

}
